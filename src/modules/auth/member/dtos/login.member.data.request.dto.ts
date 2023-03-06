import { ApiProperty } from '@nestjs/swagger'
import { IsNumberString, IsOptional, IsString, Length } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class LoginMemberDataMobileNumberRequestDTO
{
    @ApiProperty()
    @Length(11, 11, { message: i18nValidationMessage('validation.length_string', { field: 'mobile_number', length: 11 }) })
    @IsNumberString({ no_symbols: true }, { message: i18nValidationMessage('validation.is_number_string', { field: 'mobile_number' }) })
    mobileNumber: string

    toString()
    {
        return JSON.stringify({
            mobileNumber: this.mobileNumber,
        })
    }
}

export class LoginMemberDataCodeRequestDTO
{
    @ApiProperty()
    @Length(6, 6, { message: i18nValidationMessage('validation.length', { field: 'code', length: 6 }) })
    @IsNumberString({ no_symbols: true }, { message: i18nValidationMessage('validation.is_number_string', { field: 'code' }) })
    code: string

    toString()
    {
        return JSON.stringify({
            code: this.code,
        })
    }
}

export class LoginMemberDataRegistrationRequestDTO
{
    @ApiProperty()
    @IsString({ message: i18nValidationMessage('validation.is_string', { field: 'nickname' }) })
    @IsOptional({ message: i18nValidationMessage('validation.is_optional', { field: 'nickname' }) })
    nickname?: string

    @ApiProperty()
    @IsString({ message: i18nValidationMessage('validation.image_id_is_wrong') })
    @IsOptional({ message: i18nValidationMessage('validation.is_optional', { field: 'image' }) })
    mediaId?: string

    toString()
    {
        return JSON.stringify({
            nickname: this.nickname,
            mediaId: this.mediaId,
        })
    }
}