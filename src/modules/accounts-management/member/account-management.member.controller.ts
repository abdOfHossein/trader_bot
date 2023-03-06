import { Request } from 'express'
import { Body, Controller, Get, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common'
import { SuccessStatusResponseInterceptor } from 'src/modules/api/interceptors/success-status.response.interceptor'
import { AccountMemberUpdateRequestDTO } from '../dtos/account.member.update.request.dto'
import { AccountManagementMemberService } from './account-management.member.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { MemberAccessTokenJwtAuthGuard } from 'src/modules/auth/member/guards/member.access-token.jwt.auth.guard'
import { AccountMemberAllSettingsUpdateRequestDTO } from './dtos/account-member.settings.update.request.dto'
import { SuccessStatusWithDataResponseInterceptor } from 'src/modules/api/interceptors/success-status-with-data.response.interceptor'
import { ThrottlerBehindProxyGuard } from 'src/modules/global/guards/throttler-behind-proxy.guard'

@ApiTags('Acconut Management')
@ApiBearerAuth()
@Controller('account-management/member')
@UseGuards(ThrottlerBehindProxyGuard, MemberAccessTokenJwtAuthGuard)
export class AccountManagementMemberController
{
    constructor(private readonly accountManagementMemberService: AccountManagementMemberService) { }

    @UseInterceptors(SuccessStatusWithDataResponseInterceptor)
    @Get()
    getProfile(@Req() request: Request)
    {
        return this.accountManagementMemberService.getProfile(request.user[ 'id' ])
    }

    @UseInterceptors(SuccessStatusResponseInterceptor)
    @Put()
    updateProfile(@Req() request: Request, @Body() accountMemberUpdateRequestDTO: AccountMemberUpdateRequestDTO)
    {
        return this.accountManagementMemberService.updateProfile(accountMemberUpdateRequestDTO, request.user[ 'id' ])
    }

    @UseInterceptors(SuccessStatusResponseInterceptor)
    @Put('settings')
    updateAccountSettings(@Req() request: Request, @Body() accountMemberAllSettingsUpdateRequestDTO: AccountMemberAllSettingsUpdateRequestDTO)
    {
        return this.accountManagementMemberService.updateAccountSettings(accountMemberAllSettingsUpdateRequestDTO, request.user[ 'id' ])
    }
}