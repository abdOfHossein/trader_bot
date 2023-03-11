import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export class LoginLevelTwoDto {

     @ApiProperty()
     @IsString()
     @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
     password: string


     toString() {
          return JSON.stringify({
               password: this.password,
          })
     }
}