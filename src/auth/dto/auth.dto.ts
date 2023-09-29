import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ default: 'nyilynnhtwe@gmail.com' })
  @IsString()
  email: string;

  @ApiProperty({ default: 'nyilynnhtwe' })
  @IsString()
  password: string;
}

export class RegisterDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  gender: GenderEnum;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNumber()
  countryId: number;
}

export class ConfirmDto {
  @ApiProperty()
  @IsString()
  password: string;
}

export class UpdateProfileImage {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
}

enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
  GENDERQUEER = 'GENDERQUEER',
  GENDERFLUID = 'GENDERFLUID',
  TRANSGENDER = 'TRANSGENDER',
  CISGENDER = 'CISGENDER',
  OTHER = 'OTHER',
}
