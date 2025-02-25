import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SmsService {
  private smsApiUrl: string;
  private apiKey: string;

  constructor(private configService: ConfigService) {
    this.smsApiUrl = this.configService.get<string>('SMS_API_URL');
    this.apiKey = this.configService.get<string>('SMS_API_KEY');
  }

  async sendVerificationSms(phone: string, code: string): Promise<void> {
    await axios.post(this.smsApiUrl, {
      phone,
      message: `Your verification code is: ${code}`,
      apiKey: this.apiKey,
    });
  }
}
