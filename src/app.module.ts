import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app/app.controller';
import { AppService } from './app/app.service';
import configLoader from './config/index';
import { Account, AccountSchema } from './database/mongoose/schema/account.schema';
import { Log, LogSchema } from './database/mongoose/schema/log.schema';
import { MongoLogger } from './loggers/mongo.logger';
import { AccountManagementManagerialModule } from './modules/accounts-management/managerial/account-management.managerial.module';
import { AuthManagerialModule } from './modules/auth/managerial/auth.managerial.module';

console.log(process.env.MONGO_INITDB_USERNAME);
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configLoader],
      isGlobal: true,
      envFilePath: '.env',
    }),
    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 10,
    //   storage: new ThrottlerStorageRedisService(
    //     `redis://${process.env.REDIS_HOSTNAME}:${process.env.REDIS_PORT}`,
    //   ),
    // }),
    MongooseModule.forRoot(
      'mongodb://127.0.0.1:27017/trader_bot'
      // `mongodb://${process.env.MONGO_INITDB_USERNAME }:${process.env.MONGO_INITDB_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_INITDB_DATABASE}`,
    ),
    // I18nModule.forRoot({
    //   fallbackLanguage: 'en-US',
    //   fallbacks: { 'en-*': 'en-US', 'fa-*': 'fa-IR' },
    //   loaderOptions: {
    //     path: path.join(__dirname, '/locales/i18n'),
    //     includeSubfolders: true,
    //     watch: true,
    //   },
    //   typesOutputPath:
    //     process.env.NODE_ENV === 'production'
    //       ? undefined
    //       : path.join(__dirname, '../src/generated/i18n.generated.ts'),
    //   resolvers: [
    //     new QueryResolver(['lang', 'l']),
    //     new HeaderResolver(['x-custom-lang']),
    //     new CookieResolver(),
    //     AcceptLanguageResolver,
    //   ],
    // }),
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: Log.name, schema: LogSchema },
    ]),
    AuthManagerialModule,
    AccountManagementManagerialModule
  ],
  controllers: [AppController],
  providers: [AppService, MongoLogger],
  exports: [MongoLogger],
})
export class AppModule { }
