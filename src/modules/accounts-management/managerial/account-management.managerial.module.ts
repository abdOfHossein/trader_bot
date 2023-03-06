import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Account, AccountSchema } from 'src/database/mongoose/schema/account.schema'
import { AccountsSubscriptions, AccountsSubscriptionsSchema } from 'src/database/mongoose/schema/subscription/accounts-subscriptions.schema'
import { AccountManagementManagerialController } from './account-management.managerial.controller'
import { AccountManagementManagerialService } from './account-management.managerial.service'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Account.name, schema: AccountSchema },
            { name: AccountsSubscriptions.name, schema: AccountsSubscriptionsSchema },
        ]),
    ],
    controllers: [AccountManagementManagerialController],
    providers: [AccountManagementManagerialService],
})
export class AccountManagementManagerialModule { }
