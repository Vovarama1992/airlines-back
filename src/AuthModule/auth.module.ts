import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/PrismaModule/prisma.module';
import { JwtModule } from 'src/JwtModule/jwt.module';
import { AuthController } from './auth.controller';
import { SmsService } from './sms.service';
import { EmailService } from './email.service';

@Module({
  imports: [PrismaModule, JwtModule],
  providers: [AuthService, SmsService, EmailService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
