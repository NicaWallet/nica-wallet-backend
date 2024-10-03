import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserConnectionLogService {
    constructor(private readonly prisma: PrismaService) { }

    // Get all connection logs with pagination
    async findAll(page: number = 1, limit: number | string = 10, all: boolean = false) {
        // Asegúrate de que `limit` es un número
        const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;

        // Si se pasa `all` como true, omitir la paginación
        const take = all ? undefined : parsedLimit;
        const skip = all ? undefined : (page - 1) * parsedLimit;

        // Obtener el total de registros sin paginación
        const totalRecords = await this.prisma.userConnectionLog.count();

        // Calcular el total de páginas
        const totalPages = take ? Math.ceil(totalRecords / parsedLimit) : 1;

        // Obtener los datos paginados o sin paginación
        const data = await this.prisma.userConnectionLog.findMany({
            skip: skip,  // Saltar registros si se está paginando
            take: take,  // Limitar el número de registros si se está paginando
            orderBy: {
                created_at: 'desc',
            },
            include: {
                user: {
                    select: {
                        first_name: true,
                        middle_name: true,
                        first_surname: true,
                        second_surname: true,
                        email: true,
                        userRoles: {
                            select: {
                                role: true,
                            },
                        },
                    },
                },
            },
        });

        return {
            totalRecords,
            totalPages,  // Total de páginas calculadas
            currentPage: page,
            data,
        };
    }

    // Get all connection logs for a specific user by user ID
    async findByUserId(userId: number) {
        return this.prisma.userConnectionLog.findMany({
            where: { user_id: userId },
        });
    }

    // Get a specific connection log by connection ID
    async findOne(connectionId: number) {
        return this.prisma.userConnectionLog.findUnique({
            where: { connection_id: connectionId },
        });
    }

    // Delete a specific connection log by connection ID
    async remove(connectionId: number) {
        return this.prisma.userConnectionLog.delete({
            where: { connection_id: connectionId },
        });
    }

    async updateLogoutTime(connectionId: number) {
        return this.prisma.userConnectionLog.update({
            where: { connection_id: connectionId },
            data: { logout_time: new Date() },  // Registra el tiempo de logout
        });
    }

    async filterByDateRange(startDate: Date, endDate: Date) {
        return this.prisma.userConnectionLog.findMany({
            where: {
                login_time: {
                    gte: startDate, // Greater than or equal to
                    lte: endDate,   // Less than or equal to
                },
            },
        });
    }

    async findLatest(limit: number) {
        return this.prisma.userConnectionLog.findMany({
            orderBy: { login_time: 'desc' },
            take: limit, // Limitar la cantidad de resultados
        });
    }

    async countLogs() {
        return this.prisma.userConnectionLog.count();
    }


}
