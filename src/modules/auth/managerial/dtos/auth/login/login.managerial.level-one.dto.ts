import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsPhoneNumber, IsString } from "class-validator"

export class LoginLevelOneDto {

     @IsString()
     @ApiProperty()
     username: string

     @ApiProperty()
     @IsEmail()
     email: string

     @ApiProperty()
     @IsPhoneNumber("IR")
     phonenumber: string

     toString() {
          return JSON.stringify({
               username: this.username,
               email: this.email,
               phonenumber: this.phonenumber
          })
     }

}