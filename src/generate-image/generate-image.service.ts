import { HttpException, Injectable } from '@nestjs/common';
import { CreateGenerateImageDto } from './dto/create-generate-image.dto';
import { UpdateGenerateImageDto } from './dto/update-generate-image.dto';
import { PrismaService } from 'src/prisma.service';
import { IAuthRequest } from 'src/libs/auth-request';
import { CustomResponser } from 'src/libs/custom-responer';
import Replicate from 'replicate';
import * as fs from 'fs';
import axios from 'axios';
import { generateImageUrl } from 'src/libs/request-image-url';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class GenerateImageService {
  constructor(private prismaService: PrismaService) {}

  async create(
    req: IAuthRequest,
    createGenerateImageDto: CreateGenerateImageDto,
  ) {
    // try {
    // const { filename, path } = file;
    try {
      const requestedImageUrl = await generateImageUrl(
        createGenerateImageDto.content,
        createGenerateImageDto.isLandscape,
      );
      const imageUrl = requestedImageUrl[0];
      // const imageUrl = 'https://replicate.delivery/pbxt/1ymOA6nwBYIWLxrX94fkQ0duazsM3ZVF3FhLvIIysQKVlHuIA/out-0.png';
      const response = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream',
      });

      const filterArr = imageUrl.split('/');
      const originalImageName = filterArr[filterArr.length - 1];
      const originalImageType = originalImageName.split('.')[1];

      const imageName =
        (await this.imageNameGenerator()) + '.' + originalImageType;
      const path = 'uploads/generatedImages/' + imageName;
      const generatedImage = await this.prismaService.generateImage.create({
        data: {
          content: createGenerateImageDto.content,
          GeneratedImage: {
            create: {
              imageStatus: 'GENERATED',
              name: imageName,
              path:
                process.env.NODE_ENV === 'development'
                  ? `${req.protocol}://${req.hostname}:5500/api/file/${path}`
                  : `${req.protocol}://${req.hostname}/api/file/${path}`,
            },
          },
          GeneratedBy: {
            connect: {
              id: req.user.id,
            },
          },
        },
      });

      const outputPath = './uploads/generatedImages/';
      fs.mkdir(
        outputPath,
        {
          recursive: true,
        },
        async () => {
          const writer = await fs.createWriteStream(
            './uploads/generatedImages/' + imageName,
          );
          console.log(writer);

          response.data.pipe(writer);

          return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });
        },
      ); //
      if (generatedImage) {
        return CustomResponser({
          statusCode: 200,
          message: 'User generated image successfully',
          devMessage: 'user-generated-image-successfully',
          body: generatedImage,
        });
      }
    } catch (err) {
      throw new HttpException(
        { message: 'Internal server 111 error occurred', devMessage: err },
        500,
      );
    }
  }

  async findAll(userId: string) {
    try {
      const images = await this.prismaService.generateImage.findMany({
        where: {
          generatedById: userId,
        },
        include: {
          GeneratedBy: true,
          GeneratedImage: true,
        },
      });
      if (images) {
        return CustomResponser({
          statusCode: 200,
          message: 'fetch generated images successfully',
          devMessage: 'fetch-generated-images-successfully',
          body: images,
        });
      } else {
        return CustomResponser({
          statusCode: 200,
          message: 'can not fetch generated image successfully',
          devMessage: 'can-not-fetch-generated-image-successfully',
          body: images,
        });
      }
    } catch (error) {
      throw new ExceptionsHandler(error.message);
    }
  }

  async findOne(imageId: string) {
    try {
      const images = await this.prismaService.generateImage.findMany({
        where: {
          id: imageId,
        },
        include: {
          GeneratedBy: true,
          GeneratedImage: true,
        },
      });
      if (images) {
        return CustomResponser({
          statusCode: 200,
          message: 'fetch generated image successfully',
          devMessage: 'fetch-generated-image-successfully',
          body: images,
        });
      } else {
        return CustomResponser({
          statusCode: 200,
          message: 'can not fetch generated image successfully',
          devMessage: 'can-not-fetch-generated-image-successfully',
          body: images,
        });
      }
    } catch (error) {
      throw new ExceptionsHandler(error.message);
    }
  }

  async imageNameGenerator() {
    let name = '';
    for (let index = 0; index < 20; index++) {
      name += `${Math.floor(Math.random() * 9)}`;
    }
    return name;
  }
}
