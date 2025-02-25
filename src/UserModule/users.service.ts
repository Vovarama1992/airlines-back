import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/PrismaModule/prisma.service';
import { Request } from 'express';
import { UpdateProfileDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async authenticate(req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException(
        'Authorization header for route getProfile missing',
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const userId = decoded.sub;

      for (const region of ['PENDING', 'RU', 'OTHER'] as const) {
        const user = await this.prismaService
          .getUserModel(region)
          .findUnique({ where: { id: userId } });
        if (user) return user;
      }

      throw new NotFoundException('User not found');
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async updateProfile(req: Request, updateData: UpdateProfileDto) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException(
        'Authorization header for route updateProfile missing',
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const userId = decoded.sub;

      for (const region of ['PENDING', 'RU', 'OTHER'] as const) {
        const userModel = this.prismaService.getUserModel(region);
        const user = await userModel.findUnique({ where: { id: userId } });

        if (user) {
          return await userModel.update({
            where: { id: userId },
            data: updateData,
          });
        }
      }

      throw new NotFoundException('User not found');
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
