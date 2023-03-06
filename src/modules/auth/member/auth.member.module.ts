import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import { Log, LogSchema } from 'src/database/mongoose/schemas/log.schema'
import { AccountsSubscriptions, AccountsSubscriptionsSchema } from 'src/database/mongoose/schemas/subscription/accounts-subscriptions.schema'
import { Subscription, SubscriptionSchema } from 'src/database/mongoose/schemas/subscription/subscription.schema'
import { Account, AccountSchema } from '../../../database/mongoose/schemas/account.schema'
import { NotificationModule } from '../../notifications/notification.module'
import { AuthLoginMemberController } from './controllers/login/auth.login.member.controller'
import { MemberAccessTokenWsJwtAuthGuard } from './guards/member.access-token.jwt.ws.auth.guard'
import { SendVerificationCodeActionsAndResponseInterceptor } from './interceptors/send-verification-code-actions-and-response.intercetor'
import { AuthLoginMemberOTPService } from './services/login/auth.login.member.otp.service'
import { MemberAccessTokenJwtStrategy } from './strategies/member.access-token.jwt.strategy'
import { MemberRefreshTokenJwtStrategy } from './strategies/member.refresh-token.jwt.strategy'

@Module({
    imports: [
        PassportModule,
        JwtModule.register({}),
        MongooseModule.forFeature([
            { name: Account.name, schema: AccountSchema },
            { name: AccountsSubscriptions.name, schema: AccountsSubscriptionsSchema },
            { name: Log.name, schema: LogSchema },
            { name: Subscription.name, schema: SubscriptionSchema },
        ]),
        NotificationModule,
    ],
    controllers: [ AuthLoginMemberController ],
    providers: [
        SendVerificationCodeActionsAndResponseInterceptor,
        AuthLoginMemberOTPService,
        MemberAccessTokenJwtStrategy,
        MemberRefreshTokenJwtStrategy,
        MemberAccessTokenWsJwtAuthGuard,
    ],
})
export class AuthMemberModule { }
