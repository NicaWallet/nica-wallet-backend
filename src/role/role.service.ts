import { Get, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleService {
    constructor(private readonly prisma: PrismaService) { }

    // Obtener todos los roles disponibles
    findAll() {
        return this.prisma.role.findMany();
    }

    // Get role by id
    async findOne(id: number) {
        if (!id) {
            throw new Error('The id parameter is required');
        }

        return this.prisma.role.findUnique({
            where: {
                role_id: id,
            },
            select: {
                role_id: true,
                role_name: true,
            },
        });
    }



}
