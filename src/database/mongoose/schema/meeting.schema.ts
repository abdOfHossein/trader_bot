import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Exclude } from 'class-transformer'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'
// import { MeetingStatusesEnum } from './meeting/meeting.member.schema'
import { MeetingMember, MeetingMemberSchema } from './meeting/meeting.member.schema'
import { MeetingSettings } from './meeting/meeting.settings.schema'
import { Note } from './note.schema'

export type MeetingDocument = HydratedDocument<Meeting>

@Schema({ timestamps: true })
export class Meeting
{
    @Prop({ required: true, type: String, unique: true })
    code: string

    @Prop({ required: true, type: String })
    name: string

    // Filling in code
    @Prop({ type: String })
    url: string

    @Prop({ type: String })
    password?: string

    // Filling in code
    @Prop({ type: Boolean })
    hasPassword?: boolean

    @Prop({ reuired: true, type: MeetingSettings })
    @Exclude({ toPlainOnly: true })
    settings: MeetingSettings

    @Prop({ type: [ MeetingMemberSchema ], default: [], unique: false })
    members: MeetingMember[]

    @Prop({ type: [ MongooseSchema.Types.ObjectId ], ref: Note.name, default: [] })
    notes: string[]

    @Prop({ type: MongooseSchema.Types.ObjectId })
    chat: string
    
    @Prop({ type: Boolean, default: false })
    isRunning: boolean
    
    // @Prop({ type: String, default: MeetingStatusesEnum.Enabled })
    // status: MeetingStatusesEnum

    @Prop({ type: Date })
    startedAt?: Date

    @Prop({ type: Date })
    endedAt?: Date

    @Prop({ type: Date })
    deletedAt?: Date
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting)