import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { LoginMemberRequestDTO } from '../dtos/login.member.request.dto'
import { NotificationsStatusesResponse } from '../enums/notifications/notifications-statuses-response.enum'
import { NotificationsBroadcastResponseResult } from '../interfaces/notifications-broadcast-response-result.interface'
import { AuthLoginMemberOTPService } from '../services/login/auth.login.member.otp.service'
import { StatusesResponseEnum } from '../../../api/enums/statuses.response.enum'
import { MessageCodesResponseEnum } from '../enums/message-codes.response.enum'
import { LoginMemberResponseDto } from '../dtos/login.member.response.dto'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class SendVerificationCodeActionsAndResponseInterceptor
{
    constructor(
        private readonly authLoginMemberOTPService: AuthLoginMemberOTPService,
        private readonly i18nService: I18nService
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<any>
    {
        const body = context.switchToHttp().getRequest().body as LoginMemberRequestDTO
        const result = next.handle()
        
        if ((!body.level || body.level === 1) && body.data?.mobileNumber)
        {
            const cacheKeyOTPVerification = this.authLoginMemberOTPService.getCacheKeyOTPVerification(
                body.data.mobileNumber,
                body.data.countryCode
            )
            return result.pipe(this.fixResponseForSendVerificationCode(cacheKeyOTPVerification))
        }
        return result
    }

    fixResponseForSendVerificationCode(cacheKeyOTPVerification: string)
    {
        return map((response: { notificationResult: NotificationsBroadcastResponseResult[], token: string }) =>
        {
            let result: NotificationsBroadcastResponseResult = {
                status: NotificationsStatusesResponse.Error,
                messageCode: MessageCodesResponseEnum.CanNotGetDataFromNotificationsService,
                message: this.i18nService.t('errors.error_in_receiving_a_response_from_the_desired_service'),
            }

            if (response?.notificationResult && response.notificationResult.length)
            {
                result = response.notificationResult[ 0 ]
            }

            const finalResponse = new LoginMemberResponseDto()

            switch (result.status)
            {
                case NotificationsStatusesResponse.Success:
                    finalResponse.status = StatusesResponseEnum.Success
                    finalResponse.token = response.token
                    break
                
                case NotificationsStatusesResponse.Error:
                case NotificationsStatusesResponse.Failed:
                    finalResponse.status = StatusesResponseEnum.Failed
                    finalResponse.data = {
                        messageKey: result.messageCode,
                        message: result.message,
                    }
            }

            return finalResponse
        })
    }
}