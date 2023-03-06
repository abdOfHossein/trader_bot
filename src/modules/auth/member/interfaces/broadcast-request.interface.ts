import { BroadcastActionsEnum } from '../enums/notifications/broadcast-actions.enum'
import { BroadcastChannelsEnum } from '../enums/notifications/broadcast-channels.enum'
import { BroadcastEnginesEnum } from '../enums/notifications/broadcast-engines.enum'

export interface BroadcastRequestInterface
{
    id?: string
    type: BroadcastChannelsEnum
    engine?: BroadcastEnginesEnum
    action?: BroadcastActionsEnum
    data: any
}
