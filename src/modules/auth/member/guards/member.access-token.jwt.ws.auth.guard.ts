import { Cache } from 'cache-manager'
import { CACHE_MANAGER, ExecutionContext, Inject, Injectable, CanActivate } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { WsException } from '@nestjs/websockets'
import { I18nContext } from 'nestjs-i18n'
import { I18nTranslations } from 'src/generated/i18n.generated'

@Injectable()
export class MemberAccessTokenWsJwtAuthGuard implements CanActivate
{
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        const i18n = I18nContext.current<I18nTranslations>()
        const bearerToken = context.getArgs()[ 0 ].handshake.headers.authorization.split(' ')[ 1 ]
        try
        {
            const account = this.jwtService.verify(bearerToken, { publicKey: this.configService.get('secret.auth.member.accessToken.publicKey') }) as { _id: string }
            
            const blockedAccounts = await this.cacheManager.get('blockedAccounts') as string[]
            return !blockedAccounts.includes(account._id)
        }
        catch (ex)
        {
            throw new WsException(i18n.t('errors.unauthorized'))
        }
    }
}
