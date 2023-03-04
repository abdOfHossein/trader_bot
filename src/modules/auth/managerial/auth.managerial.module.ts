import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import {
  Account,
  AccountSchema,
} from 'src/database/mongoose/schema/account.schema';
import { AuthLoginManagerialController } from './controllers/auth/login/auth.login.managerial.controller';
import { AuthLoginManagerialLocalService } from './services/auth.login.managerial.local.service';
import { ManagerialAccessTokenJwtStrategy } from './strategies/managerial.access-token.jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  controllers: [AuthLoginManagerialController],
  providers: [
    AuthLoginManagerialLocalService,
    ManagerialAccessTokenJwtStrategy,
  ],
})
export class AuthManagerialModule {}
