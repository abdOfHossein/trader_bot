import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Cache } from 'cache-manager'
import { Model } from 'mongoose'
import { Account, AccountDocument } from 'src/database/mongoose/schema/account.schema'
import { AuthorizationRolesEnum } from 'src/enums/authorization.roles.enum'
import { AccountTypeEnum } from '../enums/account-type.enum'

@Injectable()
export class AccountManagementManagerialService {
    constructor(
        // @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    ) { }

    async checkAdminAccountIsExists() {
        if (!await this.accountModel.findOne({ accountType: AccountTypeEnum.Managerial })) {
            const password = bcrypt.hashSync(process.env.ADMIN_PASSWORD, bcrypt.genSaltSync(parseInt(process.env.APP_BCRYPT_SALT_ROUND)))     
            const account = new this.accountModel({
                data: {
                    firstName: 'Admin',
                    lastName: 'Hazrati',
                    mobileNumber: '09033953396',
                },
                authenticationData: {
                    username: process.env.ADMIN_USERNAME,
                    password: password,
                },
                authorizationData: {
                    role: AuthorizationRolesEnum.Admin,
                    permissions: [],
                },
                accountType: AccountTypeEnum.Managerial,
            })
            await account.save()
        }
    }

    // async getBlockedAccounts() {
    //     const blockedAccounts = await this.accountModel.find({ blockedAt: { $exists: 1 } }).select('id')
    //     await this.cacheManager.set('blockedAccounts', blockedAccounts.map(x => x.id.toString()))
    // }

}