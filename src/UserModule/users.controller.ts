import { Controller, Get, Put, Request, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request as Req } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserProfileResponseDto, UpdateProfileDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Получить профиль текущего пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Успешное получение профиля',
    type: UserProfileResponseDto,
  })
  @Get('profile')
  async getProfile(@Request() req: Req) {
    return this.usersService.authenticate(req);
  }

  @ApiOperation({ summary: 'Обновить профиль пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Профиль успешно обновлён',
    type: UserProfileResponseDto,
  })
  @Put('profile')
  async updateProfile(@Request() req: Req, @Body() body: UpdateProfileDto) {
    return this.usersService.updateProfile(req, body);
  }
}
