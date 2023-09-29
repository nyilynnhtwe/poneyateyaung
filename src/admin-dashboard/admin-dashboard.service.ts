import { Injectable } from '@nestjs/common';
import { CustomResponser } from 'src/libs/custom-responer';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AdminDashBoardService {
  constructor(private prismaService: PrismaService) {}

  getUsers = async () => {
    const users = await this.prismaService.user.findMany({
      where: {
        role: 'MEMBER',
      },
    });
    return CustomResponser({
      devMessage: 'get-all-users',
      message: 'Get all users',
      body: users,
      statusCode: 200,
    });
  };

  getUserById = async (userId: string) => {
    const users = await this.prismaService.user.findUnique({
      where: {
        id: userId,
        role: 'MEMBER',
      },
    });
    if (users) {
      return CustomResponser({
        devMessage: 'get-user-by-id',
        message: 'Get all users',
        body: users,
        statusCode: 200,
      });
    } else {
      return CustomResponser({
        devMessage: 'user-not-found',
        message: 'User not found',
        body: users,
        statusCode: 404,
      });
    }
  };
}
