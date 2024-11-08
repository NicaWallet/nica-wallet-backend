import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';

@Injectable()
export class ActivityMiddleware implements NestMiddleware {
    constructor(private readonly authService: AuthService) { }

    use(req: Request, res: Response, next: NextFunction) {
        // console.log('ActivityMiddleware is being called');
        // console.log('ActivityMiddleware is being called for path:', req.path);

        // Excluir rutas específicas
        const excludedPaths = ['/auth/login', '/auth/register'];
        if (excludedPaths.includes(req.path)) {
            return next();
        }

        const token = req.headers.authorization?.split(' ')[1];
        // console.log('Token received:', token);

        if (token) {
            try {
                // Decodificar el token antes de verificar la expiración
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                // console.log('Decoded token:', decoded);

                // Llama a la función validateSessionExpiration para verificar el tiempo de inactividad
                this.authService.validateSessionExpiration(token);
                next();
            } catch (error) {
                // console.error('Error verifying token:', error.message);
                throw new UnauthorizedException('Invalid or expired token');
            }
        } else {
            // console.error('Token not found');
            throw new UnauthorizedException('Token not found');
        }
    }
}
