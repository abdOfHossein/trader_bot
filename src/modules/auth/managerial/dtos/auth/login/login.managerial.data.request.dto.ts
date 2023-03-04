import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class LoginManagerialDataRequestDTO
{
    @ApiProperty()
    @IsString({ message: i18nValidationMessage('validation.is_string', { field: 'username' }) })
    username: string

    @ApiProperty()
    @IsString({ message: i18nValidationMessage('validation.is_string', { field: 'password' }) })
    password: string

    toString()
    {
        return JSON.stringify({
            username: this.username,
            password: this.password,
        })
    }
}
