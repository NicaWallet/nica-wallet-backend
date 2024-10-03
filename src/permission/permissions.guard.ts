import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermission = this.reflector.get<string>('permission', context.getHandler());
        if (!requiredPermission) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user; // El usuario debería estar en el request tras la autenticación JWT

        if (!user) {
            return false; // No hay usuario autenticado
        }

        const isAdmin = await this.isUserAdmin(user.userId); // Verifica si el usuario es Admin
        if (isAdmin) {
            return true; // Admin tiene acceso completo
        }

        const permissions = await this.getUserPermissions(user.userId);
        return permissions.includes(requiredPermission); // Verifica los permisos
    }

    async isUserAdmin(userId: number): Promise<boolean> {
        const userRoles = await this.prisma.userRole.findMany({
            where: { user_id: userId },
            include: {
                role: true,
            },
        });
        return userRoles.some(userRole => userRole.role.role_name === 'Admin');
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
}
