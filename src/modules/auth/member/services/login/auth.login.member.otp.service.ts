import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Cache } from 'cache-manager'
import { Model } from 'mongoose'
import { I18nContext } from 'nestjs-i18n'
import { Account, AccountDocument } from 'src/database/mongoose/schema/account.schema'
import { Log, LogDocument } from 'src/database/mongoose/schema/log.schema'
import { AccountsSubscriptions, AccountsSubscriptionsDocument } from 'src/database/mongoose/schema/subscription/accounts-subscriptions.schema'
import { Subscription,SubscriptionDocument } from 'rxjs' 
import { LogCategoriesEnum } from 'src/enums/log-categories.enum'
import { I18nTranslations } from 'src/generated/i18n.generated'
import { MongoLogger } from 'src/loggers/mongo.logger'
import { SubscriptionTypes } from 'src/modules/finance/enums/subscription-types.enum'
import { AccountTypeEnum } from '../../../../accounts-management/enums/account-type.enum'
import { AccountMemberModel } from '../../../../accounts-management/models/account-member.model'
import { StatusesResponseEnum } from '../../../../api/enums/statuses.response.enum'
import { LoginMemberDataRegistrationRequestDTO } from '../../../../auth/member/dtos/login.member.data.request.dto'
import { LoginMemberResponseDto } from '../../../../auth/member/dtos/login.member.response.dto'
import { RandomService } from '../../../../global/services/random.service'
import { NotificationService } from '../../../../notifications/services/notification.service'
import { LoginStatuses } from '../../enums/login-statuses.enum'
import { BroadcastActionsEnum } from '../../enums/notifications/broadcast-actions.enum'
import { BroadcastChannelsEnum } from '../../enums/notifications/broadcast-channels.enum'
import { BroadcastEnginesEnum } from '../../enums/notifications/broadcast-engines.enum'
import { SendVerificationCodeInterface } from '../../interfaces/send-verification-code.interface'
import { VerifyOTPInterface } from '../../interfaces/verify-otp.interface'
import { LoginService } from './login.service'

@Injectable()
export class AuthLoginMemberOTPService extends LoginService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
        @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
        @InjectModel(AccountsSubscriptions.name) private accountsSubscriptionsModel: Model<AccountsSubscriptionsDocument>,
        @InjectModel(Log.name) private logModel: Model<LogDocument>,
        private readonly jwtService: JwtService,
        private readonly randomService: RandomService,
        private readonly notificationService: NotificationService,
        private readonly configService: ConfigService,
        private readonly mongoLogger: MongoLogger,
    ) { super() }

    async sendVerificationCode(data: SendVerificationCodeInterface) {
        const cacheOTPVerificationKey = this.getCacheKeyOTPVerification(data.mobileNumber, data.countryCode)

        let token: string = await this.cacheManager.get(cacheOTPVerificationKey),
            CODE: string = ''

        if (token)
            CODE = (await this.cacheManager.get(token))['code'] // => { ...data, CODE }

        if (!CODE) {
            const generatedCodeAndToken = await this.generateVerificationCodeAndCreateToken(data)
            CODE = generatedCodeAndToken.code
            token = generatedCodeAndToken.token
        }

        return {
            notificationResult: await this.notificationService.broadcastNow({
                type: BroadcastChannelsEnum.Sms,
                engine: BroadcastEnginesEnum.SmsIr,
                action: BroadcastActionsEnum.SendVerificationCode,
                data: {
                    ...data,
                    variables: { CODE },
                },
            }),
            token,
        }
    }

    async verify(data: VerifyOTPInterface, token: string) {
        const i18n = I18nContext.current<I18nTranslations>()
        let cachedData = await this.cacheManager.get<{ id?: string, countryCode?: string, mobileNumber: string, code: string }>(token)

        if (!cachedData)
            throw new BadRequestException(i18n.t('auth.validation.your_time_to_enter_the_program_has_expired_Please_log_in_again_from_the_beginning'))

        if (data.code !== cachedData.code)
            throw new BadRequestException(i18n.t('auth.validation.verification_code_is_incorrect'))

        const cacheOTPVerificationKey = this.getCacheKeyOTPVerification(cachedData.mobileNumber, cachedData.countryCode)
        await this.removeCacheKeys(token, cacheOTPVerificationKey)

        return cachedData
    }

    async removeCacheKeys(...keys: string[]) {
        for (let key of keys)
            await this.cacheManager.del(key)
    }

    async generateVerificationCodeAndCreateToken(data: SendVerificationCodeInterface): Promise<{ code: string, token: string }> {
        const cacheOTPVerificationKey = this.getCacheKeyOTPVerification(data.mobileNumber, data.countryCode)

        const code = Math.floor(this.randomService.generateRandomNumber(100000, 999999)).toString()

        const token = await this.generateToken(this.tokenDataOTPVerification(1, {
            countryCode: data.countryCode,
            mobileNumber: data.mobileNumber,
            code,
        }))

        const fiveMinitues = 300000 // => 5 * 60 * 1000
        await this.cacheManager.set(cacheOTPVerificationKey, token, fiveMinitues)
        await this.cacheManager.set(token, { ...data, code }, fiveMinitues)

        return { code, token }
    }

    async generateAccessTokenForTheAccount(account) {
        const accountModel = new AccountMemberModel()
        accountModel.id = account._id
        accountModel.nickname = account.data.nickname
        accountModel.mobileNumber = account.data.mobileNumber
        accountModel.countryCode = account.data.countryCode
        accountModel.mediaId = account.data.mediaId

        const isFirstLogin = !(await this.logModel.findOne({
            $and: [
                { category: LogCategoriesEnum.AccountLogin },
                { optionalParams: { $elemMatch: { accountId: { $in: [accountModel.id] } } } },
            ]
        }))

        if (isFirstLogin)
            this.activeTrialSubscriptionForAccount(accountModel.id)

        const i18n = I18nContext.current<I18nTranslations>()
        this.mongoLogger.log(i18n.t('auth.responses.login_successfully', { lang: 'en-US' }), LogCategoriesEnum.AccountLogin, { accountId: accountModel.id, status: LoginStatuses.Success })

        return {
            isFirstLogin,
            accessToken: this.jwtService.sign({ data: JSON.parse(accountModel.toString()) }, {
                algorithm: 'PS512',
                issuer: 'Neshast Auth',
                expiresIn: '7d',
                privateKey: this.configService.get('secret.auth.member.accessToken.privateKey'),
            }),
            refreshToken: this.jwtService.sign({ data: { id: accountModel.id } }, {
                algorithm: 'PS512',
                issuer: 'Neshast Auth',
                expiresIn: '30d',
                privateKey: this.configService.get('secret.auth.member.refreshToken.privateKey'),
            }),
        }
    }

    async CreateTokenForCreationAccount(mobileNumber: string, countryCode?: string): Promise<LoginMemberResponseDto> {
        const token = await this.generateToken(this.tokenDataOTPCreationAccount(2, {
            countryCode,
            mobileNumber,
        }))

        await this.cacheManager.set(token, { countryCode, mobileNumber }, 300000) // => 5 * 60 * 1000

        const finalResponse = new LoginMemberResponseDto()

        finalResponse.status = StatusesResponseEnum.Success
        finalResponse.token = token
        if (!finalResponse.data)
            finalResponse.data = {}
        finalResponse.data['isRegister'] = false

        return finalResponse
    }

    async findAccountById(id: string) {
        return await this.accountModel.findById(id).exec()
    }

    async findAccount(mobileNumber: string, countryCode?: string) {
        return await this.accountModel.findOne({
            'accountType': AccountTypeEnum.Member,
            'data.countryCode': countryCode,
            'data.mobileNumber': mobileNumber,
        }).exec()
    }

    async createAccount(data: LoginMemberDataRegistrationRequestDTO, token: string) {
        const i18n = I18nContext.current<I18nTranslations>()
        let cachedData = await this.cacheManager.get<{ id?: string, countryCode?: string, mobileNumber: string }>(token)

        if (!cachedData)
            throw new BadRequestException(i18n.t('auth.validation.your_time_to_register_the_program_has_expired_Please_register_again_from_the_beginning'))

        const account = await this.findAccount(cachedData.mobileNumber, cachedData.countryCode)
        if (account)
            return account

        const createdAccount = new this.accountModel({
            accountType: AccountTypeEnum.Member,
            data: {
                nickname: data.nickname,
                mobileNumber: cachedData.mobileNumber,
                countryCode: cachedData.countryCode,
                mediaId: data.mediaId,
            },
            settings: {
                meeting: {
                    muteMicrophoneAtJoinToMeeting: { default: true },
                    closeCameraAtJoinToMeeting: { default: false },
                    showJoiningPreviewBeforeJoinToMeeting: { default: true },
                    isVideoMirror: { default: false },
                    hdCamera: { default: false },
                    showReceivedNotifications: { default: true },
                }
            }
        })

        await this.removeCacheKeys(token)

        return createdAccount.save()
    }

    async activeTrialSubscriptionForAccount(accountId: string) {
        const isNotExistsSubscription = !(await this.accountsSubscriptionsModel.findOne({
            $and: [
                { account: { $in: [accountId] } },
                { expiredAt: { $lt: new Date() } },
            ]
        }))

        if (isNotExistsSubscription) {
            const trialSubscription = await this.subscriptionModel.findOne({ type: SubscriptionTypes.Trial })
            const expiredAt = Date.now() + trialSubscription.interval * 86400000 // 86400000 => 1 day in milliseconds

            const accountsSubscriptions = new this.accountsSubscriptionsModel({
                account: accountId,
                subscription: trialSubscription.id,
                type: SubscriptionTypes.Trial,
                startedAt: Date.now(),
                expiredAt: new Date(expiredAt),
            })
            await accountsSubscriptions.save()
        }
    }
}
