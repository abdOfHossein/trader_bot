import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'
import { Account } from './account.schema'
import { NoteReference } from './subscription/note/note.reference.schema'  

export type NoteDocument = HydratedDocument<Note>
@Schema({ timestamps: true })
export class Note
{
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: Account.name })
    accountRegistrar: string

    @Prop({ required: true, type: String })
    content: string

    @Prop({ type: NoteReference })
    reference?: NoteReference
}

export const NoteSchema = SchemaFactory.createForClass(Note)