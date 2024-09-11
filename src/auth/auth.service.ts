import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create({
      ...registerDto,
      username: registerDto.email.split('@')[0], // Generar username por defecto
    });
    return user;
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(userId, changePasswordDto.newPassword);
  }

  async confirmEmail(userId: number) {
    return this.usersService.confirmEmail(userId);
  }

  async verifyTwoFactorCode(userId: number, code: string) {
    return this.usersService.verifyTwoFactorCode(userId, code);
  }
}
