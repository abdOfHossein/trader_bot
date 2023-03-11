import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'
import { AccountAuthorizationData } from './account/account-authorization.data.schema'
import { AccountManagerial } from './account/types/account-managerial.type.schema'
import { AccountMember } from './account/types/account-member.type.schema'

export type AccountDocument = HydratedDocument<Account>

@Schema({ timestamps: true })
export class Account {
    // @Prop({
    //     required: true,
    //     enum: AccountTypeEnum,
    //     type: String,
    //     default: AccountTypeEnum.Member
    // })
    // accountType: AccountTypeEnum

    @Prop({ required: true, type: MongooseSchema.Types.Mixed })
    data: AccountMember | AccountManagerial

    @Prop({ type: MongooseSchema.Types.Mixed })
    authenticationData: Record<string, any> = {}

    @Prop({ type: AccountAuthorizationData })
    authorizationData: AccountAuthorizationData = {}

    @Prop({ type: Object })
    subscription?: Record<string, any>

    @Prop({ type: Date })
    blockedAt?: Date
}

export const AccountSchema = SchemaFactory.createForClass(Account)