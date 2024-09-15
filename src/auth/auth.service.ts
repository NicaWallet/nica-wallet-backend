import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,  // Asegúrate de que es UserService
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: pass, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload = { email: user.email, sub: user.user_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }


  // TODO: Implementar metodo register
  // async register(registerDto: RegisterDto) {
  //   const user = await this.usersService.create({
  //     ...registerDto,
  //     username: registerDto.email.split('@')[0], // Generar username por defecto
  //   });
  //   return user;
  // }

  // TODO: Implementar metodo resetPassword
  // async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
  //   return this.usersService.changePassword(userId, changePasswordDto.newPassword);
  // }

  // TODO: Implementar metodo resetPassword
  // async confirmEmail(userId: number) {
  //   return this.usersService.confirmEmail(userId);
  // }

  // TODO: Implementar metodo resetPassword
  // async verifyTwoFactorCode(userId: number, code: string) {
  //   return this.usersService.verifyTwoFactorCode(userId, code);
  // }
}
