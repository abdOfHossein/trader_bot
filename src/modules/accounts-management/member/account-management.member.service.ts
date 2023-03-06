import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { I18nContext } from 'nestjs-i18n'
import { Account, AccountDocument } from 'src/database/mongoose/schema/account.schema'
import { AccountsSubscriptions, AccountsSubscriptionsDocument } from 'src/database/mongoose/schema/subscription/accounts-subscriptions.schema'
import { I18nTranslations } from 'src/generated/i18n.generated'
import { AccountMemberUpdateRequestDTO } from '../dtos/account.member.update.request.dto'
import { AccountMemberAllSettingsUpdateRequestDTO } from './dtos/account-member.settings.update.request.dto'

@Injectable()
export class AccountManagementMemberService {
    constructor(
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
        @InjectModel(AccountsSubscriptions.name) private accountsSubscriptionsModel: Model<AccountsSubscriptionsDocument>,
    ) { }

    async getProfile(id: string) {
        const i18n = I18nContext.current<I18nTranslations>()
        const account = await this.accountModel.findById(id)
        if (!account)
            throw new NotFoundException(i18n.t('errors.account_not_found'))
        const subscription = await this.accountsSubscriptionsModel.findOne({
            $and: [
                { account: { $in: [account.id] } },
                { startedAt: { $lte: new Date() } },
                { expiredAt: { $gt: new Date() } },
            ]
        }).sort({ expiredAt: -1 })

        if (subscription)
            account.subscription = { type: subscription.type, expiredAt: subscription.expiredAt }
        return account
    }

    async updateProfile(data: AccountMemberUpdateRequestDTO, id: string) {
        return await this.accountModel.findByIdAndUpdate(id, {
            $set: {
                'data.nickname': data.nickname,
                'data.mediaId': data.mediaId,
            }
        })
    }

    async updateAccountSettings(allSettings: AccountMemberAllSettingsUpdateRequestDTO, id: string) {
        const updateObject: Record<string, any> = {}
        for (let settings of allSettings.settings) {
            Object.entries(settings.data).forEach(([key, value]) => {
                updateObject[`settings.${settings.category}.${key}`] = { default: value }
            })
        }
        return await this.accountModel.findByIdAndUpdate(id, { $set: updateObject })
    }
}