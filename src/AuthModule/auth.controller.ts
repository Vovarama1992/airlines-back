import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  RegisterDto,
  VerifyEmailDto,
  VerifyPhoneDto,
  LoginDto,
} from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь зарегистрирован' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @ApiOperation({ summary: 'Подтверждение email' })
  @ApiResponse({
    status: 200,
    description: 'Email подтверждён, пользователь перенесён в основную БД',
  })
  @ApiResponse({ status: 400, description: 'Неверный код' })
  @Post('verify-email')
  async verifyEmail(@Body() body: VerifyEmailDto) {
    return this.authService.verifyEmail(body);
  }

  @ApiOperation({ summary: 'Подтверждение телефона' })
  @ApiResponse({ status: 200, description: 'Телефон подтверждён' })
  @ApiResponse({ status: 400, description: 'Неверный код' })
  @Post('verify-phone')
  async verifyPhone(@Body() body: VerifyPhoneDto) {
    return this.authService.verifyPhone(body);
  }

  @ApiOperation({ summary: 'Логин пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход, выдаётся JWT-токен',
  })
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
