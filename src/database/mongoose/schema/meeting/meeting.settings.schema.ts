import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type MeetingSettingsDocument = HydratedDocument<MeetingSettings>

@Schema({ _id: false, timestamps: false })
export class MeetingSettings
{
    @Prop({ type: Number })
    joiningTimeAfterHostJoined?: number

    @Prop({ type: Boolean, default: false })
    isLock: boolean = false

    @Prop({ type: Boolean, default: true })
    allowJoinBeforeHost: boolean = true

    @Prop({ type: Boolean, default: true })
    muteParticipantsOnEntry: boolean = true

    @Prop({ type: Boolean, default: true })
    muteParticipantsOnEntryForce: boolean = true

    @Prop({ type: Boolean, default: true })
    onlyHostsCanShareScreen: boolean = true

    @Prop({ type: Boolean, default: true })
    onlyHostsCanRecord: boolean = true
}

export const MeetingSettingsSchema = SchemaFactory.createForClass(MeetingSettings)