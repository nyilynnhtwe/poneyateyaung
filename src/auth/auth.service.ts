import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { RegisterDto } from './dto/auth.dto';
import { CustomResponser } from 'src/libs/custom-responer';
import { EmailSender } from 'src/libs/email-sender';
import { hash, verify } from 'argon2';
import { GenerateToken } from 'src/libs/generate-verify-token';
import { IAuthRequest } from 'src/libs/auth-request';
import * as fs from 'fs';
import { Request as ExpressRequest } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signIn(
    req: ExpressRequest,
    email: string,
    password: string,
  ): Promise<any> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: email,
      },
    });
    const ips =
      typeof req.headers['x-forwarded-for'] === 'string'
        ? req.headers['x-forwarded-for']
        : req.headers['x-forwarded-for'].join('');
    await this.prismaService.userIpMapping.create({
      data: {
        ip: ips,
        userId: user.id,
      },
    });
    if (user) {
      if (!user.password) {
        return CustomResponser({
          statusCode: 404,
          devMessage: 'have-not-been-registered-yet',
          message: 'Have not been registered yet',
          body: null,
        });
      }
      const isPasswordMatch = verify(user.password, password);
      if (!isPasswordMatch) {
        return CustomResponser({
          statusCode: 403,
          devMessage: 'user-password-incorrect',
          message: 'User password is incorrect',
          body: null,
        });
      } else if (isPasswordMatch) {
        await this.prismaService.user.update({
          data: {
            accountStatus: 'ACTIVE',
            lastOnline: new Date(),
          },
          where: {
            id: user.id,
          },
        });

        const payload = {
          id: user.id,
          role: user.role,
        };
        const token = {
          accesstoken: await this.jwtService.signAsync(payload, {
            secret: jwtConstants.secret,
            expiresIn: '1d',
          }),
        };
        console.log(1);

        return CustomResponser({
          statusCode: 201,
          devMessage: 'user-authentication-successuful',
          message: 'User authenticated successfully',
          body: token,
        });
      }
    }
    return CustomResponser({
      statusCode: 403,
      devMessage: 'user-email-not-found',
      message:
        'The email address you entered is not registered in our system. Please check the email or sign up for an account.',
      body: null,
    });
  }

  async fetchUserInfo(userId: string): Promise<any> {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        Location: true,
        GenerateImage: true,
      },
    });
    if (user) {
      return CustomResponser({
        statusCode: 404,
        devMessage: 'user-infos-have-been-fetched-successfully',
        message: 'User info have been fetched successfully.',
        body: user,
      });
    }
    return CustomResponser({
      statusCode: 403,
      devMessage: 'user-infos-have-not-been-fetched-successfully',
      message: 'User infos have been fetched successfully',
      body: null,
    });
  }

  async register(registerDto: RegisterDto) {
    const alreadyExistedUser = await this.prismaService.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    if (alreadyExistedUser) {
      if (alreadyExistedUser.email) {
        return CustomResponser({
          statusCode: 403,
          message: 'User already existed',
          devMessage: 'user-already-existed',
          body: alreadyExistedUser,
        });
      }
    } else {
      // const verifyToken  = await GenerateToken(registerDto.);
      const recordedUser = await this.prismaService.user.create({
        data: {
          username: registerDto.username,
          email: registerDto.email,
          gender: registerDto.gender,
          Location: {
            create: {
              city: registerDto.city,
              country: {
                connect: {
                  id: registerDto.countryId,
                },
              },
            },
          },
        },
      });

      const payload = {
        id: recordedUser.id,
        name: recordedUser.username,
      };

      // generate jwt token to send with email ( will live about 2h )
      const token = {
        access_token: await this.jwtService.signAsync(payload, {
          secret: jwtConstants.secret,
          expiresIn: '2h',
        }),
      };
      if (token) {
        if (recordedUser) {
          await EmailSender({
            email: registerDto.email,
            token: token.access_token,
          });
          return CustomResponser({
            statusCode: 201,
            message: 'User register successfully',
            devMessage: 'user-register-successfully',
            body: recordedUser,
          });
        } else {
          return CustomResponser({
            statusCode: 201,
            message: 'User can not register successfully',
            devMessage: 'user-cant-register-successfully',
            body: null,
          });
        }
      }
    }
  }

  async confirm({ token, body }) {
    const decoded = await this.jwtService.verify(token, {
      secret: jwtConstants.secret,
    });

    const currentUser = await this.prismaService.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (currentUser) {
      const updatedUser = await this.prismaService.user.update({
        data: {
          password: await hash(body.password),
          isVerified: true,
        },
        where: {
          id: currentUser.id,
        },
      });

      if (updatedUser) {
        return CustomResponser({
          statusCode: 201,
          message: 'User confirmed successfully',
          devMessage: 'user-confirmed-successfully',
          body: updatedUser,
        });
      }
      return CustomResponser({
        statusCode: 201,
        message: 'User can not confirm successfully',
        devMessage: 'user-cant-confirm-successfully',
        body: null,
      });
    }
  }

  async updateProfilePicture(req: IAuthRequest, image: Express.Multer.File) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        Profile: true,
      },
    });

    if (user.Profile) {
      const path = user.Profile.path;
      fs.unlink(path, (err) => {
        if (err) throw err;
      });
      const removedProfilePicutreUser = await this.prismaService.file.delete({
        where: {
          id: user.Profile.id,
        },
      });
    }

    const updatedUser = await this.prismaService.user.update({
      data: {
        Profile: {
          create: {
            name: image.filename,
            path: 'uploads/profile-pictures/' + image.filename,
            imageStatus: 'PROFILE',
          },
        },
      },
      where: {
        id: req.user.id,
      },
      include: {
        Profile: true,
        Location: true,
      },
    });

    if (!updatedUser) {
      return CustomResponser({
        statusCode: 403,
        message: 'User already existed',
        devMessage: 'user-already-existed',
        body: null,
      });
    }
    return CustomResponser({
      statusCode: 201,
      message: 'User updated profile picture',
      devMessage: 'user-updated-profile-picture',
      body: updatedUser,
    });
  }
}
