import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, now, Schema as MongooseSchema } from 'mongoose'
// import { MeetingMemberAccessLevelEnum } from 'src/modules/meetings/enum/meeting-member-access-level.enum'
import { Account } from '../account.schema'

export type MeetingMemberDocument = HydratedDocument<MeetingMember>

@Schema({ _id: false, timestamps: true })
export class MeetingMember
{
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Account.name })
    account: string

    // @Prop({ type: String, enum: MeetingMemberAccessLevelEnum, default: MeetingMemberAccessLevelEnum.Member })
    // accessLevel: MeetingMemberAccessLevelEnum = MeetingMemberAccessLevelEnum.Member

    @Prop({ type: Date, default: now })
    joinedAt: Date

    @Prop({ type: Date })
    blockedAt?: Date
}

export const MeetingMemberSchema = SchemaFactory.createForClass(MeetingMember)