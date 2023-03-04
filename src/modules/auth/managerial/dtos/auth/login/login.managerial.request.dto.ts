import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmptyObject, IsNumber, IsOptional, IsString } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'
import { LoginManagerialDataRequestDTO } from './login.managerial.data.request.dto'

export class LoginManagerialRequestDTO
{
    @ApiProperty({ default: { username: 'xxxxxxxx', password: 'xxxxxx' } })
    // @ValidateNested()
    @Type(() => LoginManagerialDataRequestDTO)
    @IsNotEmptyObject({}, { message: i18nValidationMessage('validation.is_not_empty_object', { field: 'data' }) })
    data: Record<string, any>

    @ApiProperty({ default: 1 })
    @IsNumber({}, { message: i18nValidationMessage('validation.is_number', { field: 'level' }) })
    @IsOptional({ message: i18nValidationMessage('validation.is_optional', { field: 'level' }) })
    level: number = 1

    @ApiProperty({ default: '$2b$10$gt2EkkJ/...' })
    @IsString({ message: i18nValidationMessage('validation.is_string', { field: 'token' }) })
    @IsOptional({ message: i18nValidationMessage('validation.is_optional', { field: 'token' }) })
    token?: string

    toString()
    {
        return JSON.stringify({
            data: this.data,
            level: this.level,
            token: this.token,
        })
    }
}