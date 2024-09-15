import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {  // Asegúrate de que es 'UserService' y no 'UsersService'
  constructor(private readonly prisma: PrismaService) { }

  // Método para validar al usuario con email y contraseña
  async validateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }

  // Buscar un usuario por email
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Crear un usuario
  async createUser(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        birthdate: new Date(createUserDto.birthdate), 
      },
    });
  }

  // TODO: Implementar servicio para Cambiar la contraseña
  // async changePassword(userId: number, newPassword: string) {
  //   const hashedPassword = await bcrypt.hash(newPassword, 10);
  //   return this.prisma.user.update({
  //     where: { id: userId },
  //     data: { password: hashedPassword },
  //   });
  // }


  // TODO: Implementar servicio para Confirmar el correo electrónico
  // async confirmEmail(userId: number) {
  //   return this.prisma.user.update({
  //     where: { id: userId },
  //     data: { emailConfirmed: true },
  //   });
  // }


  // TODO: Implementar servicio para  Verificar el código de 2FA
  // async verifyTwoFactorCode(userId: number, code: string): Promise<boolean> {
  //   const user = await this.prisma.user.findUnique({
  //     where: { id: userId },
  //   });

  //   // Aquí puedes agregar la lógica para verificar el código 2FA.
  //   // Ejemplo: si el código es correcto, retorna true, si no, retorna false.
  //   return user.twoFactorCode === code;
  // }

  // TODO: Implementar servicio para  Actualizar un usuario
  // async findAll() {
  //   return this.prisma.user.findMany();
  // }


  // TODO: Implementar servicio para  Buscar un usuario por ID
  // async findOne(id: number) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { id },
  //   });
  //   if (!user) {
  //     throw new NotFoundException(`User with ID ${id} not found`);
  //   }
  //   return user;
  // }


  // TODO: Implementar servicio para  Actualizar un usuario
  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   const user = await this.prisma.user.update({
  //     where: { id },
  //     data: updateUserDto,
  //   });
  //   return user;
  // }


  // TODO: Implementar servicio para  Eliminar un usuario
  // async remove(id: number) {
  //   await this.prisma.user.delete({
  //     where: { id },
  //   });
  //   return { message: `User with ID ${id} deleted` };
  // }
}
