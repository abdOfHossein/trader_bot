import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { Log, LogSchema } from 'src/database/mongoose/schema/log.schema'
import { AccountsSubscriptions, AccountsSubscriptionsSchema } from 'src/database/mongoose/schema/subscription/accounts-subscriptions.schema'
import { MongoLogger } from 'src/loggers/mongo.logger'
import { MemberAccessTokenWsJwtAuthGuard } from '../auth/member/guards/member.access-token.jwt.ws.auth.guard'
import { ThrottlerBehindProxyGuard } from './guards/throttler-behind-proxy.guard'
import { LoggingInterceptor } from './interceptors/logging.intercetor'
import { DatabaseFilterService } from './services/database-filter.service'
import { PaginationService } from './services/pagination.service'
import { RandomService } from './services/random.service'

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AccountsSubscriptions.name, schema: AccountsSubscriptionsSchema },
            { name: Log.name, schema: LogSchema },
        ]),
        JwtModule,
    ],
    providers: [
        DatabaseFilterService,
        PaginationService,
        RandomService,
        LoggingInterceptor,
        MongoLogger,
        MemberAccessTokenWsJwtAuthGuard,
        ThrottlerBehindProxyGuard,
    ],
    exports: [
        DatabaseFilterService,
        PaginationService,
        RandomService,
        LoggingInterceptor,
        MongoLogger,
        MemberAccessTokenWsJwtAuthGuard,
        ThrottlerBehindProxyGuard,
    ],
})
export class GlobalModule { }
