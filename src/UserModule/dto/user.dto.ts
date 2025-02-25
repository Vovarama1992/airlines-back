import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UserProfileResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'johnny' })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({ example: '+123456789' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '@durov' })
  @IsString()
  @IsOptional()
  telegram?: string;
}

export class UpdateProfileDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'johnny' })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({ example: '+123456789' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '@durov' })
  @IsString()
  @IsOptional()
  telegram?: string;
}
