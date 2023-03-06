import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class AccountMemberSettingsUpdateRequestDTO
{
    @ApiProperty()
    @IsString({ message: i18nValidationMessage('validation.is_string', { field: 'category' }) })
    category: string

    @ApiProperty()
    @IsNotEmptyObject(undefined, { message: i18nValidationMessage('validation.is_not_empty_object', { field: 'data' }) })
    data: Record<string, unknown>
}

export class AccountMemberAllSettingsUpdateRequestDTO
{
    @ApiProperty({
        default: [
            {
                category: 'meeting',
                data: {
                    muteMicrophoneAtJoinToMeeting: true,
                    closeCameraAtJoinToMeeting: false,
                    hdCamera: false,
                    showJoiningPreviewBeforeJoinToMeeting: true,
                    isVideoMirror: false,
                    showReceivedNotifications: true,
                }
            }
        ]
    })
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => AccountMemberSettingsUpdateRequestDTO)
    settings: AccountMemberSettingsUpdateRequestDTO[]
}