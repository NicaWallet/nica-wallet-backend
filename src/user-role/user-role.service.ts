import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRoleService {

    constructor(private readonly prisma: PrismaService) { }

    findAll() {
        return this.prisma.userRole.findMany({
            select: {
                user: {
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
                        userConnectionLogs: {
                            orderBy: {
                                login_time: 'desc'
                            },
                            take: 1,
                            select: {
                                connection_id: true,
                                login_time: true,
                                logout_time: true,
                                user_id: true
                            }
                        }
                    }
                },
                role: {
                    select: {
                        role_id: true,
                        role_name: true,
                    }
                },
                // created_at: true,
                // updated_at: true
            }
        });
    }

}
