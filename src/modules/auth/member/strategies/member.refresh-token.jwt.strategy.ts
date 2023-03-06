import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MemberRefreshTokenJwtStrategy extends PassportStrategy(Strategy, 'member-refresh-token-jwt')
{
    constructor(configService: ConfigService)
    {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('secret.auth.member.refreshToken.publicKey'),
        })
    }

    async validate(payload: any)
    {
        return payload.data
    }
}