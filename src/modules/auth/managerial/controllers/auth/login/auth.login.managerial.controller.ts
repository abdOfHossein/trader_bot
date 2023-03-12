import { Body, Controller, Post } from '@nestjs/common'
import { UseGuards } from '@nestjs/common/decorators'
import { ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { ThrottlerBehindProxyGuard } from 'src/modules/global/guards/throttler-behind-proxy.guard'
import { LoginLevelOneDto } from '../../../dtos/auth/login/login.managerial.level-one.dto'
import { LoginLevelTwoDto } from '../../../dtos/auth/login/login.managerial.level-three.dto'
import { loginLevelThreeDto } from '../../../dtos/auth/login/login.managerial.level-two.dto'
import { AuthLoginManagerialLocalService } from '../../../services/auth.login.managerial.local.service'

@ApiTags('Authentication')
// @UseGuards(ThrottlerBehindProxyGuard)
@Controller('auth/login/managerial')
export class AuthLoginManagerialController {
    constructor(private readonly authLoginManagerialLocalService: AuthLoginManagerialLocalService) { }

    // Generate level-1 token in interceptor
    @Throttle(3, 60)
    @Post()
    async loginLevelOne(@Body() { username, email, phonenumber }: LoginLevelOneDto) {

        const validateData = username
        let account = await this.authLoginManagerialLocalService.validateUser(username)
        return this.authLoginManagerialLocalService.generateAccessTokenForTheAccount(account)
    }

    // @Throttle(3, 60)
    // @Post()
    // async loginLevelTwo(@Body() { password }: LoginLevelTwoDto) {
    //     let account = await this.authLoginManagerialLocalService.validateUser( password )

    //     return this.authLoginManagerialLocalService.generateAccessTokenForTheAccount(account)
    // }

    // @Throttle(3, 60)
    // @Post()
    // async loginLevelThree(@Body() data: loginLevelThreeDto) {
    // }
}
