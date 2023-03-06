import { NotificationsStatusesResponse } from "../enums/notifications/notifications-statuses-response.enum"

export interface NotificationsBroadcastResponseResult
{
    id?: string
    status: NotificationsStatusesResponse
    messageCode?: string
    message?: string
}