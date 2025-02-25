import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.connectToRedis();
  }

  private connectToRedis() {
    const host = this.configService.get<string>('REDIS_HOST') || 'localhost';
    const port = this.configService.get<number>('REDIS_PORT') || 6379;
    const db = this.configService.get<number>('REDIS_DB') || 0;
    const password =
      this.configService.get<string>('REDIS_PASSWORD') || undefined;

    try {
      this.redisClient = new Redis({
        host,
        port,
        db,
        password,
        retryStrategy: (times) => {
          const delay = Math.min(times * 1000, 10000);
          this.logger.warn(`Retrying Redis connection in ${delay / 1000}s...`);
          return delay;
        },
      });

      this.redisClient.on('connect', () => {
        this.logger.log('Redis connected successfully.');
      });

      this.redisClient.on('error', (err) => {
        this.logger.error(`Redis connection error: ${err.message}`);
      });
    } catch (error) {
      this.logger.error(`Failed to initialize Redis: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
    this.logger.log('Redis connection closed.');
  }
}
