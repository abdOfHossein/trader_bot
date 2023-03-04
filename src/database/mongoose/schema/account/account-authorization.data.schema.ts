import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose'
import { AuthorizationPermissionsEnum } from 'src/enums/authoriation.permissions.enum'
import { AuthorizationRolesEnum } from 'src/enums/authorization.roles.enum'

export type AccountSettingsDocument = HydratedDocument<AccountAuthorizationData>

@Schema({ _id: false })
export class AccountAuthorizationData
{
    @Prop({ required: false, type: String, enum: AuthorizationRolesEnum })
    role?: AuthorizationRolesEnum
    
    @Prop({ required: false, type: MongooseSchema.Types.Array })
    permissions?: AuthorizationPermissionsEnum[]
}

export const AccountSettingsSchema = SchemaFactory.createForClass(AccountAuthorizationData)