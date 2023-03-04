import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type AccountManagerialDocument = HydratedDocument<AccountManagerial>

@Schema({ _id: false })
export class AccountManagerial
{
    @Prop({ required: true, type: String })
    firstName: string

    @Prop({ required: true, type: String })
    lastName: string

    @Prop({ required: true, type: String })
    mobileNumber: string

    @Prop({ type: String })
    mediaId?: string
}

export const AccountManagerialSchema = SchemaFactory.createForClass(AccountManagerial)