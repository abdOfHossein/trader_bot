import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthLoginManagerialLocalService } from '../../../services/auth.login.managerial.local.service'
import { LoginManagerialRequestDTO } from '../../../dtos/auth/login/login.managerial.request.dto'
import { Throttle } from '@nestjs/throttler'
import { ThrottlerBehindProxyGuard } from 'src/modules/global/guards/throttler-behind-proxy.guard'

@ApiTags('Authentication')
// @UseGuards(ThrottlerBehindProxyGuard)
@Controller('auth/login/managerial')
export class AuthLoginManagerialController
{
    constructor(private readonly authLoginManagerialLocalService: AuthLoginManagerialLocalService) { }

    // Generate level-1 token in interceptor
    @Throttle(3, 60)
    @Post()
    async loginRequest(@Body() { data }: LoginManagerialRequestDTO)
    {
        let account = await this.authLoginManagerialLocalService.validateUser({ username: data.username, password: data.password })

        return this.authLoginManagerialLocalService.generateAccessTokenForTheAccount(account)
    }
}
