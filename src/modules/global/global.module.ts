import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { ThrottlerGuard } from '@nestjs/throttler'
import { Log, LogSchema } from 'src/database/mongoose/schema/log.schema'
import { MongoLogger } from 'src/loggers/mongo.logger'
import { ThrottlerBehindProxyGuard } from './guards/throttler-behind-proxy.guard'
import { LoggingInterceptor } from './interceptors/logging.intercetor'
import { DatabaseFilterService } from './services/database-filter.service'
import { PaginationService } from './services/pagination.service'
import { RandomService } from './services/random.service'

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
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
        // ThrottlerBehindProxyGuard,
    ],
    exports: [
        DatabaseFilterService,
        PaginationService,
        RandomService,
        LoggingInterceptor,
        MongoLogger,
        ThrottlerBehindProxyGuard,
    ],
})
export class GlobalModule { }
