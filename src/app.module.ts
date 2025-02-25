import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { UsersModule } from './UserModule/users.module';
import { JwtModule } from './JwtModule/jwt.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './PrismaModule/prisma.module';
import { AuthModule } from './AuthModule/auth.module';
import * as express from 'express';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule,

    JwtModule,

    UsersModule,

    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(express.static(join(__dirname, '..', 'uploads')))
      .forRoutes('*');
  }
}
