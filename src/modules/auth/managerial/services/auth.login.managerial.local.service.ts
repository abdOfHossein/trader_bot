import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
// import { AccountTypeEnum } from 'src/modules/accounts-management/enums/account-type.enum'
// import { AccountManagerialModel } from 'src/modules/accounts-management/models/account-managerial.model'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Account } from 'src/database/mongoose/schema/account.schema'

@Injectable()
export class AuthLoginManagerialLocalService {
    constructor(
        @InjectModel(Account.name) private readonly accountModel: Model<Document>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async validateUser(username: string) {
        const account = await this.accountModel.findOne({
            $and: [
                // { accountType: AccountTypeEnum.Managerial },
                { 'authenticationData.username': username },
            ],
        })
        return {
            // type: AccountTypeEnum.Managerial,
            data: {
                id: account._id,
                firstName: account['data'].firstName,
                lastName: account['data'].lastName,
                username: username,
                mobileNumber: account['data'].mobileNumber,
                roles: account['authorizationData'].role,
                permissions: account['authorizationData'].permissions,
            },
        }
        // const i18n = I18nContext.current<I18nTranslations>()
        // throw new BadRequestException(i18n.t('auth.validation.username_or_password_is_incorrent'))
    }

    loginLevelOne(account) {
        console.log('account in loginLevelOne',account);
        
        const token = String(Date.now()) + account.data.id
        console.log(token);

        return {
            token
        }
    }

    // generateAccessTokenForTheAccount(account)
    // {
    //     const accountModel = new AccountManagerialModel()
    //     accountModel.id = account.data.id
    //     accountModel.firstName = account.data.firstName
    //     accountModel.lastName = account.data.lastName
    //     accountModel.username = account.data.username
    //     accountModel.mobileNumber = account.data.mobileNumber
    //     accountModel.roles = account.data.roles
    //     accountModel.permissions = account.data.permissions

    //     return {
    //         access_token: this.jwtService.sign({ data: JSON.parse(accountModel.toString()) }, {
    //             algorithm: 'PS512',
    //             issuer: 'Neshast Auth - Managerial Dashboard',
    //             expiresIn: '1d',
    //             privateKey: this.configService.get('secret.auth.managerial.accessToken.privateKey'),
    //         }),
    //     }
    // }
}
