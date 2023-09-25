import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SendEmailDto {

    @ApiProperty()
    @IsString()
    subject: string;


    @ApiProperty()
    @IsString()
    body: string;


    @ApiProperty()
    @IsString()
    from: string;

    @ApiProperty()
    @IsString()
    to: string;
    
}
