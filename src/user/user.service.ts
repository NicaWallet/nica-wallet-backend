import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
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
        first_name: createUserDto.first_name,
        middle_name: createUserDto.middle_name,
        first_surname: createUserDto.first_surname,
        second_surname: createUserDto.second_surname,
        email: createUserDto.email,
        phone_number: createUserDto.phone_number,
        password: createUserDto.password,
        birthdate: new Date(createUserDto.birthdate),
      },
    });
  }

  // Get all users without passwords
  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        user_id: true,
        first_name: true,
        middle_name: true,
        first_surname: true,
        second_surname: true,
        email: true,
        phone_number: true,
        birthdate: true,
        created_at: true,
        updated_at: true,
        userRoles: {
          select: {
            role: {
              select: {
                role_name: true,
              },
            },
          },
        },
      },
    });
    return users;
  }

  // GetUserById
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: id },
      select: {
        user_id: true,
        first_name: true,
        middle_name: true,
        first_surname: true,
        second_surname: true,
        email: true,
        phone_number: true,
        birthdate: true,
        created_at: true,
        updated_at: true,
        userRoles: {
          select: {
            role: {
              select: {
                role_name: true,
              },
            },
          },
        },
      },
    });
    if (!user) {
      const message = { message: `User with ID ${id} not found` };
      return message
    }
    return user;
  }

  async getUserPermissions(userId: number) {
    const userRoles = await this.prisma.userRole.findMany({
      where: { user_id: userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    const permissions = userRoles.flatMap(userRole =>
      userRole.role.rolePermissions.map(rolePermission => rolePermission.permission.permission_name)
    );

    return permissions;
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
  // async remove(id: number, currentUserId: number) {
  //   const user = await this.prisma.user.findUnique({
  //     where: { user_id: id },
  //     select: { role_name: true },
  //   });

  //   if (!user) {
  //     return { message: `User with ID ${id} not found` };
  //   }

  //   const isAdmin = user.role_name === 'Admin';

  //   if (!isAdmin) {
  //     return { message: `User with ID ${id} is not an admin and cannot delete users` };
  //   }

  //   if (id === currentUserId) {
  //     return { message: `User cannot delete their own account` };
  //   }

  //   await this.prisma.user.delete({
  //     where: { user_id: id },
  //   });

  //   return { message: `User with ID ${id} deleted` };
  // }
}
