import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { GenerateImageService } from './generate-image.service';
import { CreateGenerateImageDto } from './dto/create-generate-image.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { IAuthRequest } from 'src/libs/auth-request';



@ApiBearerAuth()
@ApiTags("Generate Image")
@UseGuards(AuthGuard)
@Controller('generate-image')
export class GenerateImageController {
  constructor(private readonly generateImageService: GenerateImageService) {}



  @Post()
  @ApiBody({
    description: "User generate image",
    type: CreateGenerateImageDto,
  })
  @ApiOperation({ summary: "Generate image here" })
  async userUpdateProfile(@Request() req: IAuthRequest,@Body()createGenerateImageDto:CreateGenerateImageDto): Promise<any> {
    return this.generateImageService.create(req,createGenerateImageDto);
  }

  @Get()
  @ApiOperation({ summary: "Get generated images" })
  findAll(@Request() req : IAuthRequest) {
    return this.generateImageService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get generated image by id" })
  findOne(@Param('id') id: string) {
    return this.generateImageService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGenerateImageDto: UpdateGenerateImageDto) {
  //   return this.generateImageService.update(+id, updateGenerateImageDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.generateImageService.remove(+id);
  // }
}
