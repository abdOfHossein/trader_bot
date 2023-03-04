import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type AccountMemberDocument = HydratedDocument<AccountMember>

@Schema({ _id: false })
export class AccountMember
{
    @Prop({ required: true, type: String })
    nickname: string

    @Prop({ type: String })
    countryCode?: string

    @Prop({ required: true, type: String })
    mobileNumber: string

    @Prop({ type: String })
    mediaId?: string
}

export const AccountSettingsSchema = SchemaFactory.createForClass(AccountMember)