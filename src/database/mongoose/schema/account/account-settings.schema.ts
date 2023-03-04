import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { AccountSettingsMeeting } from './settings/account-settings-meeting.schema'

export type AccountSettingsDocument = HydratedDocument<AccountSettings>

@Schema({ _id: false })
export class AccountSettings
{
    @Prop({ type: AccountSettingsMeeting, default: AccountSettingsMeeting })
    meeting: AccountSettingsMeeting
}

export const AccountSettingsSchema = SchemaFactory.createForClass(AccountSettings)