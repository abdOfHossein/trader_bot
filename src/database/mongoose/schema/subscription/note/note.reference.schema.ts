import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'

export type NoteReferenceDocument = HydratedDocument<NoteReference>

@Schema({ _id: false, timestamps: false })
export class NoteReference
{
    @Prop({ required: true, type: String })
    collectionName: string

    @Prop({ type: MongooseSchema.Types.ObjectId })
    id: string
}

export const NoteReferenceSchema = SchemaFactory.createForClass(NoteReference)