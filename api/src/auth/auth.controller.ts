import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmDto, RegisterDto, SignInDto, UpdateProfileImage } from './dto/auth.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { IAuthRequest } from 'src/libs/auth-request';
import { fileStorage } from 'src/libs/file-store';
import { AuthGuard } from './auth.guard';
import { FileSizeValidationPipe } from 'src/libs/file-size-validate';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @ApiTags("Auth")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User Login' })
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }


  @ApiTags("Auth")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file',fileStorage("profile-pictures")))
  @ApiConsumes('multipart/form-data')
  @ApiBody(
    {
      description: "Profile Image",
      type: UpdateProfileImage
    }
  )
  @Post('update-profile-picture')
  uploadFile(@Request()req:IAuthRequest,@UploadedFile() file: Express.Multer.File) {
    return this.authService.updateProfilePicture(req,file);
  }




  @ApiTags("Auth")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User Register' })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }


  @ApiTags("Auth")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User Confirm by Token' })
  @ApiQuery({ name: 'token' })
  @Post('verify')
  verify(@Query() query: any, @Body() confirmDto: ConfirmDto) {
    return this.authService.confirm(
      {
        token: query.token,
        body: confirmDto
      });
  }

}
