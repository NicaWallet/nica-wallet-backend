import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.get<string>('role', context.getHandler());
        if (!requiredRole) {
            return true; // Permitir acceso si no se requiere un rol específico
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Imprimir para depuración
        console.log('User roles in request:', user.roles);

        if (user && user.roles && user.roles.some((role: string) => role.toLowerCase() === requiredRole.toLowerCase())) {
            return true; // Permitir acceso si el usuario tiene al menos uno de los roles requeridos
        }

        throw new ForbiddenException('You do not have permission to access this resource');
    }
}
