import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '../../../../packages/shared/src/rbac';

class RegisterDto {
  @IsEmail()
  email!: string;

  @MinLength(12)
  password!: string;

  @IsEnum(['Patient', 'Doctor', 'Nurse', 'Admin'] as const)
  role!: Role;
}

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }
}
