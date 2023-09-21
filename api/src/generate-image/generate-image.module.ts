import { Module } from '@nestjs/common';
import { GenerateImageService } from './generate-image.service';
import { GenerateImageController } from './generate-image.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [GenerateImageController],
  providers: [GenerateImageService,JwtService,PrismaService],
})
export class GenerateImageModule {}
