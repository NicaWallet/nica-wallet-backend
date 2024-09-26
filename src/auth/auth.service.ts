import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) { }

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

    const { password, ...safeUser } = user;

    const payload = { email: user.email, sub: user.user_id };
    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
      user: safeUser,  // Devolviendo el objeto de usuario sin los campos sensibles
    };
  }


  async register(registerDto: CreateUserDto, roleName = 'User') {
    // Verificar si el correo ya está registrado
    const existingUser = await this.usersService.findUserByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Convertir el birthdate de string a Date
    const birthdate = new Date(registerDto.birthdate).toISOString();

    try {
      // Crear el nuevo usuario sin el rol
      const newUser = await this.usersService.createUser({
        ...registerDto,
        password: hashedPassword,
        birthdate,
      });

      // Obtener el rol basado en el nombre (por ejemplo, Admin o User)
      const role = await this.prisma.role.findUnique({
        where: { role_name: roleName }, // 'roleName' es el nombre del rol (por defecto 'User')
      });

      // Asignar el rol al usuario en la tabla intermedia 'UserRole'
      await this.prisma.userRole.create({
        data: {
          user_id: newUser.user_id,
          role_id: role.role_id,
        },
      });

      return { message: 'User registered successfully, please verify your email' };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw new InternalServerErrorException();
    }
  }

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
