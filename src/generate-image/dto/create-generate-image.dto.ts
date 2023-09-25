import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class CreateGenerateImageDto {
    @ApiProperty()
    @IsString()
    content : string;

    @ApiProperty()
    @IsBoolean()
    isLandscape : boolean;
}
