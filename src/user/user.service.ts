import { Injectable, NotFoundException } from '@nestjs/common';
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
      include: {
        userRoles: {
          include: { role: true },
        },
      },
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

  // Get user by ID (profile)
  async findOne(id: number, isAdmin: boolean) {

    const TakeFiveAndOrderByDesc = {
      take: 5,
      orderBy: {
        created_at: 'desc' as const,
      },
    };

    if (isAdmin) {
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
          status: true,
          userRoles: TakeFiveAndOrderByDesc,
          addresses: TakeFiveAndOrderByDesc,
          billingInfos: TakeFiveAndOrderByDesc,
          bankDetails: TakeFiveAndOrderByDesc,
          budgets: TakeFiveAndOrderByDesc,
          goals: TakeFiveAndOrderByDesc,
          incomes: TakeFiveAndOrderByDesc,
          recurringTransactions: TakeFiveAndOrderByDesc,
          notifications: TakeFiveAndOrderByDesc,
          preferences: true,
          Category: TakeFiveAndOrderByDesc,
          Subcategory: TakeFiveAndOrderByDesc,
          transactions: TakeFiveAndOrderByDesc,
        },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    }

    // Si el usuario no es admin, devuelve solo los conteos
    const user = await this.prisma.user.findUnique({
      where: { user_id: id },
      select: {
        user_id: true,
        first_name: true,
        email: true,
        _count: {
          select: {
            addresses: true,
            budgets: true,
            goals: true,
            recurringTransactions: true,
            Category: true,
            Subcategory: true,
          },
        },
        // Devuelve solo las últimas 5 transacciones ordenadas por fecha
        transactions: {
          take: 5,
          orderBy: {
            date: 'desc', // Ordena por la fecha más reciente
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findOneUserIncludePassword(id: number) {
    return this.prisma.user.findUnique({
      where: { user_id: id },
    });
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

  async updatePassword(userId: number, hashedPassword: string) {
    return this.prisma.user.update({
      where: { user_id: userId },
      data: { password: hashedPassword },
    });
  }

}
