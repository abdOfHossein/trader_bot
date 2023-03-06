export interface SendVerificationCodeInterface
{
    id?: string
    countryCode?: string
    mobileNumber: string
    variables?: Record<string, any>
}