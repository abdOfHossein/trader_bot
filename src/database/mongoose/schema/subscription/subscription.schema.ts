import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
// import { SubscriptionTypes } from 'src/modules/finance/enums/subscription-types.enum'
import { Locale } from '../locale.schema' 

export type SubscriptionDocument = HydratedDocument<Subscription>

@Schema({ timestamps: true })
export class Subscription
{
    @Prop({ type: Locale })
    name: Locale

    // @Prop({ type: String, enum: SubscriptionTypes, default: SubscriptionTypes.Real })
    // type: SubscriptionTypes

    @Prop({ type: Number })
    interval: number
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription)