import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AdminDashBoardController } from './admin-dashboard.controller';
import { AdminDashBoardService } from './admin-dashboard.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AdminDashBoardController],
  providers: [AdminDashBoardService, PrismaService, JwtService],
})
export class AdminDashBoardModule {}
