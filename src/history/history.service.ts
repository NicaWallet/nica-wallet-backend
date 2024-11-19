import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class HistoryService {
    constructor(private readonly prisma: PrismaService) { }

    // Obtener todo el historial relacionado con las transacciones del usuario
    async getAllHistoryForUserTransactions(userId: number) {
        return this.prisma.history.findMany({
            where: {
                transaction: {
                    user_id: userId, // Relaciona con las transacciones del usuario
                },
            },
            include: {
                transaction: {
                    include: {
                        category: {
                            select: {
                                subcategories: true
                            }
                        }
                    },
                }
            },
        });
    }

    // Obtener todo el historial (admin)
    async getAllHistory() {
        return this.prisma.history.findMany({
            include: {
                transaction: {
                    include: {
                        category: {
                            select: {
                                subcategories: true
                            }
                        }
                    },
                }
            },
        });
    }

    // Obtener un registro de historial por ID, verificando la propiedad del usuario
    async getOneHistory(historyId: number, userId: number) {
        const history = await this.prisma.history.findUnique({
            where: { history_id: historyId },
            include: {
                transaction: {
                    include: {
                        category: {
                            select: {
                                subcategories: true
                            }
                        }
                    },
                }
            },
        });

        if (!history) {
            throw new NotFoundException(`History record with id ${historyId} not found`);
        }

        // Verificar si el usuario es propietario de la transacción relacionada
        if (history.transaction.user_id !== userId) {
            throw new ForbiddenException("You do not have permission to view this history record");
        }

        return history;
    }
}
