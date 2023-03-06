import { Body, Controller, NotFoundException, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common'
import { LoginMemberRequestDTO } from '../../dtos/login.member.request.dto'
import { SendVerificationCodeActionsAndResponseInterceptor } from '../../interceptors/send-verification-code-actions-and-response.intercetor'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthLoginMemberOTPService } from '../../services/login/auth.login.member.otp.service'
import { SendVerificationCodeInterface } from '../../interfaces/send-verification-code.interface'
import { VerifyOTPInterface } from '../../interfaces/verify-otp.interface'
import { MemberRefreshTokenJwtAuthGuard } from '../../guards/member.refresh-token.jwt.auth.guard'
import { I18nContext } from 'nestjs-i18n'
import { I18nTranslations } from 'src/generated/i18n.generated'
import { Log, LogDocument } from 'src/database/mongoose/schemas/log.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ThrottlerBehindProxyGuard } from 'src/modules/global/guards/throttler-behind-proxy.guard'
import { Throttle } from '@nestjs/throttler'

@ApiTags('Authentication')
@UseGuards(ThrottlerBehindProxyGuard)
@Controller('auth/login/member')
export class AuthLoginMemberController
{
    constructor(
        @InjectModel(Log.name) private logModel: Model<LogDocument>,private readonly authLoginMemberOtpService: AuthLoginMemberOTPService) { }

    // Generate level-1 token in interceptor
    @UseInterceptors(SendVerificationCodeActionsAndResponseInterceptor)
    @Throttle(15, 60)
    @Post()
    async loginRequest(@Body() { data, level, token }: LoginMemberRequestDTO)
    {
        let account
        switch (level)
        {
            case 1:
                // 'data' has mobileNumber only
                return await this.authLoginMemberOtpService.sendVerificationCode(data as SendVerificationCodeInterface)

            case 2:
                // If verification failed, then throw HttpException
                const cachedDataWithToken = await this.authLoginMemberOtpService.verify({ ...data } as VerifyOTPInterface, token)

                account = await this.authLoginMemberOtpService.findAccount(cachedDataWithToken.mobileNumber, cachedDataWithToken.countryCode)

                if (account)
                    return await this.authLoginMemberOtpService.generateAccessTokenForTheAccount(account)
                else
                    return this.authLoginMemberOtpService.CreateTokenForCreationAccount(cachedDataWithToken.mobileNumber, cachedDataWithToken.countryCode)

            case 3:
                account = await this.authLoginMemberOtpService.createAccount(data, token)

                return await this.authLoginMemberOtpService.generateAccessTokenForTheAccount(account)
        }
    }

    @ApiBearerAuth()
    @UseGuards(MemberRefreshTokenJwtAuthGuard)
    @Throttle(3, 60)
    @Post('refresh')
    async refreshToken(@Request() request)
    {
        const i18n = I18nContext.current<I18nTranslations>()
        const account = await this.authLoginMemberOtpService.findAccountById(request.user.id)
        if (!account)
            throw new NotFoundException(i18n.t('errors.account_not_found'))
        return await this.authLoginMemberOtpService.generateAccessTokenForTheAccount(account)
    }
}
