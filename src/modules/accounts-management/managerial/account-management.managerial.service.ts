import * as bcrypt from 'bcrypt'
import { Cache } from 'cache-manager'
import { BadRequestException, CACHE_MANAGER, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Account, AccountDocument } from 'src/database/mongoose/schemas/account.schema'
import { AuthorizationRolesEnum } from 'src/enums/authorization.roles.enum'
import { DatabaseFilterRequestDTO } from 'src/modules/api/classes/database-filter.request.class'
import { SortEnum } from 'src/modules/api/classes/sort.class'
import { PaginatedRequestDTO } from 'src/modules/api/dtos/paginated.request.dto'
import { PaginatedModel } from 'src/modules/api/models/paginated.model'
import { DatabaseFilterService } from 'src/modules/global/services/database-filter.service'
import { PaginationService } from 'src/modules/global/services/pagination.service'
import { AccountMemberCreateRequestDTO } from '../dtos/account.member.create.request.dto'
import { AccountMemberUpdateRequestDTO } from '../dtos/account.member.update.request.dto'
import { AccountTypeEnum } from '../enums/account-type.enum'
import { AccountMemberModel } from '../models/account-member.model'
import { AccountMemberGetAllDatabaseMongooseFilter } from './filters/database/mongoose/account-member-get-all.database.mongoose.filter'
import { I18nContext } from 'nestjs-i18n'
import { I18nTranslations } from 'src/generated/i18n.generated'
import { AccountsSubscriptions, AccountsSubscriptionsDocument } from 'src/database/mongoose/schemas/subscription/accounts-subscriptions.schema'
import { AccountManagerial } from 'src/database/mongoose/schemas/account/types/account-managerial.type.schema'
import { AccountManagerialUpdateRequestDTO } from './dtos/account.managerial.update.request.dto'
import { AccountManagerialPasswordUpdateRequestDTO } from './dtos/account.managerial.password.update.request.dto'

@Injectable()
export class AccountManagementManagerialService
{
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
        @InjectModel(AccountsSubscriptions.name) private readonly accountsSubscriptionsModel: Model<AccountsSubscriptionsDocument>,
        private readonly paginationService: PaginationService,
        private readonly databaseFilterService: DatabaseFilterService<DatabaseFilterRequestDTO>,
    ) {}

    async getProfile(id: string)
    {
        const i18n = I18nContext.current<I18nTranslations>()
        const account = await this.accountModel.findById(id)
        if (!account)
            throw new NotFoundException(i18n.t('errors.account_not_found'))

        return {
            firstName: (account.data as AccountManagerial).firstName,
            lastName: (account.data as AccountManagerial).lastName,
            mobileNumber: account.data.mobileNumber,
            mediaId: account.data.mediaId,
            username: account.authenticationData.username,
            password: account.authenticationData.password,
            role: account.authorizationData.role,
            permissions: account.authorizationData.permissions,
        }
    }

    async updateProfile(data: AccountManagerialUpdateRequestDTO, id: string)
    {
        return await this.accountModel.findByIdAndUpdate(id, { $set: {
            'data.firstName': data.firstName,
            'data.lastName': data.lastName,
            'data.mobileNumber': data.mobileNumber,
            'data.mediaId': data.mediaId,
            'authenticationData.username': data.username,
            'authorizationData.role': data.role,
        } })
    }

    async updatePassword(data: AccountManagerialPasswordUpdateRequestDTO, id: string)
    {
        const i18n = I18nContext.current<I18nTranslations>()
        const account = await this.accountModel.findById(id)
        if (await bcrypt.compare(data.oldPassword, account.authenticationData.password))
        {
            return await this.accountModel.findByIdAndUpdate(id, { $set: {
                'authenticationData.password': bcrypt.hashSync(data.password, bcrypt.genSaltSync(parseInt(process.env.APP_BCRYPT_SALT_ROUND))),
            } })
        }
        else throw new BadRequestException(i18n.t('errors.old_password_is_incorrect'))
    }

    async checkAdminAccountIsExists()
    {
        if (!await this.accountModel.findOne({ accountType: AccountTypeEnum.Managerial }))
        {
            const password = bcrypt.hashSync(process.env.ADMIN_PASSWORD, bcrypt.genSaltSync(parseInt(process.env.APP_BCRYPT_SALT_ROUND)))
            const account = new this.accountModel({
                accountType: AccountTypeEnum.Managerial,
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
            })
            await account.save()
        }
    }

    async getBlockedAccounts()
    {
        const blockedAccounts = await this.accountModel.find({ blockedAt: { $exists: 1 } }).select('id')
        await this.cacheManager.set('blockedAccounts', blockedAccounts.map(x => x.id.toString()))
    }

    async getAllMembers(data: PaginatedRequestDTO): Promise<PaginatedModel<AccountMemberModel>>
    {
        const model = new PaginatedModel<AccountMemberModel>()
        const databaseToolFilter = new AccountMemberGetAllDatabaseMongooseFilter()
        const queryFilter = this.databaseFilterService.getQuery(databaseToolFilter, data.filter ? JSON.parse(data.filter) : undefined)

        model.total = await this.accountModel.countDocuments(queryFilter)
        model.list = await this.accountModel.find(queryFilter, undefined, {
            ...this.paginationService.paginate(data.page, data.size),
            timestamps: true,
            sort: data.sort || { createdAt: SortEnum.Descending },
        })

        for (let i = 0; i < model.list.length; i++)
        {
            const subscription = await this.accountsSubscriptionsModel.findOne({ $and: [
                { account: { $in: [ model.list[ i ][ 'id' ] ] } },
                { startedAt: { $lte: new Date() } },
                { expiredAt: { $gt: new Date() } },
            ] }).sort({ expiredAt: -1 })
            
            if (subscription)
                model.list[ i ].subscription = { type: subscription.type, expiredAt: subscription.expiredAt }
        }
        
        return model
    }

    async create(data: AccountMemberCreateRequestDTO)
    {
        const i18n = I18nContext.current<I18nTranslations>()
        if (!await this.accountModel.findOne({ 'data.mobileNumber': data.mobileNumber }))
            return await this.accountModel.create({
                accountType: AccountTypeEnum.Member,
                data: { ...data },
                settings: {
                    meeting: {
                        muteMicrophoneAtJoinToMeeting: { default: true },
                        closeCameraAtJoinToMeeting: { default: false },
                        showJoiningPreviewBeforeJoinToMeeting: { default: true },
                        isVideoMirror: { default: false },
                        showReceivedNotifications: { default: true },
                    },
                },
            })
        throw new BadRequestException(i18n.t('errors.account_exists'))
    }

    async update(data: AccountMemberUpdateRequestDTO, id: string)
    {
        return await this.accountModel.findByIdAndUpdate(id, { $set: {
            'data.nickname': data.nickname,
            'data.mediaId': data.mediaId,
        } })
    }

    async block(id: string)
    {
        return await this.accountModel.findByIdAndUpdate(id, { blockedAt: Date.now() })
    }

    async unblock(id: string)
    {
        return await this.accountModel.findByIdAndUpdate(id, { $unset: { blockedAt: 1 } })
    }
}