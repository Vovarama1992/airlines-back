import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/PrismaModule/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  RegisterDto,
  VerifyEmailDto,
  VerifyPhoneDto,
  LoginDto,
} from './dto/auth.dto';
import { RedisService } from 'src/RedisModule/redis.service';
import { SmsService } from './sms.service';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly smsService: SmsService,
    private readonly emailService: EmailService,
  ) {}

  async register(body: RegisterDto) {
    const { firstName, lastName, email, phone, password } = body;
    const db = this.prismaService.getDatabase('PENDING');

    const existingUser = await db.user.findFirst({
      where: { OR: [{ phone }, { email }] },
    });
    if (existingUser) {
      throw new ForbiddenException(
        'User with this phone or email already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        isRegistered: false,
      },
    });

    // Генерируем 6-значный код
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Сохраняем код в Redis на 5 минут
    if (email) {
      await this.redisService.set(
        `email_verification:${email}`,
        verificationCode,
        300,
      );
      await this.emailService.sendVerificationEmail(email, verificationCode);
    }

    if (phone) {
      await this.redisService.set(
        `phone_verification:${phone}`,
        verificationCode,
        300,
      );
      await this.smsService.sendVerificationSms(phone, verificationCode);
    }

    return {
      userId: newUser.id,
      message: 'User registered, please verify your phone or email',
    };
  }

  async verifyEmail(body: VerifyEmailDto) {
    if (body.code !== '111111') {
      throw new BadRequestException('Invalid code');
    }

    const dbPending = this.prismaService.getDatabase('PENDING');
    const user = await dbPending.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const region = Math.random() < 0.5 ? 'RU' : 'OTHER';
    const finalDB = this.prismaService.getDatabase(region);

    const newUser = await finalDB.user.create({
      data: { ...user, isRegistered: true },
    });

    await dbPending.user.delete({ where: { id: user.id } });

    const token = this.jwtService.sign({ id: newUser.id });

    return {
      token,
      message: `Email verified, user moved to ${region} database`,
    };
  }

  async verifyPhone(body: VerifyPhoneDto) {
    if (body.code !== '111111') {
      throw new BadRequestException('Invalid code');
    }

    return { message: 'Phone verified (mocked)', success: true };
  }

  async login(body: LoginDto) {
    const db = this.prismaService.getDatabase('OTHER');

    const user = await db.user.findFirst({
      where: {
        OR: [{ email: body.email }, { phone: body.phone }],
      },
    });

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      throw new ForbiddenException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user.id });

    return { token, message: 'Login successful' };
  }
}
