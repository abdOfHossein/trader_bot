import { Body, CACHE_MANAGER, Controller, Inject, Post } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import { LoginLevelOneDto } from '../../../dtos/auth/login/login.managerial.level-one.dto'
import { AuthLoginManagerialLocalService } from '../../../services/auth.login.managerial.local.service'

@ApiTags('Authentication')
// @UseGuards(ThrottlerBehindProxyGuard)
@Controller('auth/login/managerial')
export class AuthLoginManagerialController {
    constructor(
        // @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly authLoginManagerialLocalService: AuthLoginManagerialLocalService) { }

    // Generate level-1 token in interceptor
    @Throttle(3, 60)
    @Post()
    async loginLevelOne(@Body() { username, email, phonenumber }: LoginLevelOneDto) {
        let account = await this.authLoginManagerialLocalService.validateUser(username)
        console.log('account , loginLevelOne => ', account);
        return this.authLoginManagerialLocalService.loginLevelOne(account)
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
