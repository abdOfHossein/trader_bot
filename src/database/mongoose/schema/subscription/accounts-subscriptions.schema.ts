import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'
// import { SubscriptionTypes } from 'src/modules/finance/enums/subscription-types.enum'
import { Account } from '../account.schema'
import { Subscription } from './subscription.schema'

export type AccountsSubscriptionsDocument = HydratedDocument<AccountsSubscriptions>

@Schema({ collection: 'accounts_subscriptions', timestamps: true })
export class AccountsSubscriptions
{
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Account.name })
    account: string

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: Subscription.name })
    subscription: string

    // @Prop({ type: String, enum: SubscriptionTypes })
    // type?: SubscriptionTypes

    @Prop({ type: Date })
    startedAt?: Date

    @Prop({ type: Date })
    expiredAt?: Date
}

export const AccountsSubscriptionsSchema = SchemaFactory.createForClass(AccountsSubscriptions)