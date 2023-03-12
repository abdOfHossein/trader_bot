import * as bcrypt from 'bcrypt'
import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { I18nContext } from 'nestjs-i18n'
import { I18nTranslations } from 'src/generated/i18n.generated'
import { ConfigService } from '@nestjs/config'
// import { AccountTypeEnum } from 'src/modules/accounts-management/enums/account-type.enum'
// import { AccountManagerialModel } from 'src/modules/accounts-management/models/account-managerial.model'
import { InjectModel } from '@nestjs/mongoose'
import { Account } from 'src/database/mongoose/schema/account.schema'
import { Model } from 'mongoose'

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

    generateAccessTokenForTheAccount(account) {
        return {
            access_token: this.jwtService.sign({ data: JSON.parse(account.toString()) }, {
                algorithm: 'PS512',
                issuer: 'Neshast Auth - Managerial Dashboard',
                expiresIn: '1d',
                privateKey: this.configService.get('secret.auth.managerial.accessToken.privateKey'),
            }),
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
