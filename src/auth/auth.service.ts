import * as requestIp from 'request-ip';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Request as ExpressRequest } from 'express';
import * as dotenv from 'dotenv';
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/register.dto';
import { MailService } from 'src/mail/mail.service';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
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

  async login(loginDto: LoginDto, req: ExpressRequest) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    // Obtener roles del usuario
    const userRoles = await this.prisma.userRole.findMany({
      where: { user_id: user.user_id },
      include: {
        role: true,
      },
    });

    const roles = userRoles.map(userRole => userRole.role.role_name);

    // Convertir el tipo de req a lo esperado por request-ip
    const ipAddress = requestIp.getClientIp(req as any); // Forzar el tipo compatible con request-ip
    const deviceInfo = req.headers['user-agent'] || 'Unknown device'; // Información del dispositivo

    // ** Debugging
    // console.log('IP Address:', ipAddress);
    // console.log('Device Info:', deviceInfo);
    // console.log('User:', user);
    // console.log('User Id:', user.user_id);

    // Guardar los detalles de la conexión en la tabla UserConnectionLog
    await this.prisma.userConnectionLog.create({
      data: {
        login_time: new Date(),
        logout_time: null, // El valor nulo es válido
        ip_address: ipAddress ?? 'Unknown IP',
        device_info: deviceInfo,
        user: {
          connect: { user_id: user.user_id },  // Usar la relación connect para asociar el user_id
        },
      },
    });

    const { password, ...safeUser } = user;

    const payload = { email: user.email, sub: user.user_id, roles };

    console.info('Login successful');
    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
      user: safeUser,
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

      console.info('User registered successfully');
      return { message: 'User registered successfully, please verify your email' };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw new InternalServerErrorException();
    }
  }

  /**
   * Refreshes the provided JWT token and returns a new access token along with its expiration time.
   *
   * @param token - The current JWT token to be refreshed.
   * @returns An object containing the new access token and its expiration time in the format hh:mm:ss.
   * @throws {UnauthorizedException} If the provided token is invalid or expired.
   */
  async refreshToken(token: string): Promise<{ access_token: string; expires_in: string }> {
    try {
      // Verifica el token actual para asegurarte de que sea válido
      const payload = this.jwtService.verify(token);

      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }

      // Crea un nuevo token
      const newPayload = {
        email: payload.email,
        sub: payload.sub,
        roles: payload.roles,
      };
      const expiresIn = '1h'; // Tiempo de expiración del nuevo token
      const accessToken = this.jwtService.sign(newPayload, { expiresIn });

      // Decodifica el nuevo token para obtener la fecha de expiración
      const decodedToken = jwt.decode(accessToken) as any; // Usa el tipo 'any' para obtener acceso a la propiedad 'exp'

      // Calcula el tiempo restante en segundos
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
      let timeRemaining = decodedToken.exp - currentTime; // Tiempo restante en segundos

      if (timeRemaining < 0) {
        timeRemaining = 0;
      }

      // Convierte el tiempo restante a formato hh:mm:ss
      const hours = Math.floor(timeRemaining / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((timeRemaining % 3600) / 60).toString().padStart(2, '0');
      const seconds = (timeRemaining % 60).toString().padStart(2, '0');
      const formattedTimeRemaining = `${hours}:${minutes}:${seconds}`;

      return {
        access_token: accessToken,
        expires_in: formattedTimeRemaining,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  validateSessionExpiration(token: string): void {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { exp: number, iat: number, userId: number };
    const currentTime = Math.floor(Date.now() / 1000);

    // console.log('Token issued at (iat):', decoded.iat);
    // console.log('Token expires at (exp):', decoded.exp);
    // console.log('Current time:', currentTime);

    if (currentTime - decoded.iat > Number(process.env.SESSION_TIMEOUT_MINUTES) * 60) {
      throw new UnauthorizedException('Session expired due to inactivity');
    }
  }

  async sendResetPasswordLink(email: string): Promise<void> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      console.warn('User not found with email:', email);
      throw new BadRequestException('Email not found');
    }
    // Generar el token de restablecimiento de contraseña
    const resetToken = this.jwtService.sign({ sub: user.user_id }, { expiresIn: '1h' });
    const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
    // console.log('Generated reset link:', resetLink);

    // Enviar el correo
    try {
      await this.mailService.sendResetPasswordEmail(email, user.first_name, resetLink);
    } catch (error) {
      console.error('Error sending reset password email:', error);
      throw new InternalServerErrorException('Error sending reset password email');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub;

      // Validar si la nueva contraseña es diferente a la actual
      await this.validateNewPassword(userId, newPassword);

      // Cifrar la nueva contraseña antes de actualizarla
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar la contraseña en la base de datos
      await this.usersService.updatePassword(userId, hashedPassword);

      console.log('Password reset successfully for user ID:', userId);
    } catch (error) {
      console.error('Error during password reset:', error);

      // Verificar si el error es una instancia de BadRequestException y lanzarla tal cual
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Si no, devolver un error de token inválido o expirado
      throw new UnauthorizedException('Invalid or expired token');
    }
  }


  async validateNewPassword(userId: number, newPassword: string): Promise<void> {
    // Obtener el usuario con la contraseña actual
    const user = await this.usersService.findOneUserIncludePassword(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Comparar la nueva contraseña con la actual
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('The new password must be different from the current password');
    }
  }

}
