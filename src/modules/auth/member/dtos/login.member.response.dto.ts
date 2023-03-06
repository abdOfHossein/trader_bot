import { ApiProperty } from '@nestjs/swagger'
import { StatusesResponseEnum } from 'src/modules/api/enums/statuses.response.enum'

export class LoginMemberResponseDto
{
    @ApiProperty()
    status: StatusesResponseEnum

    @ApiProperty()
    message_key?: string

    @ApiProperty()
    message?: string

    @ApiProperty()
    token?: string

    @ApiProperty()
    access_token?: string

    @ApiProperty()
    refresh_token?: string

    @ApiProperty()
    data?: Array<any> | Record<string, any>

    toString() {
        return JSON.stringify({
            status: this.status,
            message_key: this.message_key,
            message: this.message,
            token: this.token,
            access_token: this.access_token,
            refresh_token: this.refresh_token,
            data: this.data,
        })
    }
}