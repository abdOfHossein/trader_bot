import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'

export type AccountSettingsMeetingDocument = HydratedDocument<AccountSettingsMeeting>

@Schema({ _id: false })
export class AccountSettingsMeetingConfig
{
    @Prop({ type: MongooseSchema.Types.Mixed })
    default: unknown
}

@Schema({ _id: false })
export class AccountSettingsMeeting
{
    @Prop({ type: AccountSettingsMeetingConfig, default: { default: true } })
    muteMicrophoneAtJoinToMeeting: AccountSettingsMeetingConfig

    @Prop({ type: AccountSettingsMeetingConfig, default: { default: false } })
    closeCameraAtJoinToMeeting: AccountSettingsMeetingConfig

    @Prop({ type: AccountSettingsMeetingConfig, default: { default: true } })
    showJoiningPreviewBeforeJoinToMeeting: AccountSettingsMeetingConfig

    @Prop({ type: AccountSettingsMeetingConfig, default: { default: false } })
    isVideoMirror: AccountSettingsMeetingConfig

    @Prop({ type: AccountSettingsMeetingConfig, default: { default: false } })
    hdCamera: AccountSettingsMeetingConfig

    @Prop({ type: AccountSettingsMeetingConfig, default: { default: true } })
    showReceivedNotifications: AccountSettingsMeetingConfig
}

export const AccountSettingsMeetingSchema = SchemaFactory.createForClass(AccountSettingsMeeting)