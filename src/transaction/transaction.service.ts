import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  // Configuración común para el `include`, excluyendo la relación `user`
  private readonly baseIncludeOptions = {
    category: {
      select: {
        category_id: true,
        name: true,
        subcategories: {
          select: {
            subcategory_id: true,
            name: true,
          },
        },
      },
    },
    histories: {
      select: {
        history_id: true,
        created_at: true,
        transaction_id: true,
        updated_at: true,
        change_date: true,
        new_value: true,
        old_value: true,
      },
    },
    classification: {
      select: {
        classification_id: true,
        name: true,
      },
    },
  };

  // Configuración para `findAll`, que incluye la relación `user`
  private readonly includeOptionsWithUser = {
    ...this.baseIncludeOptions,
    user: {
      select: {
        user_id: true,
        first_name: true,
        first_surname: true,
        email: true,
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
    },
  };

  // Find all transactions with pagination and optional full retrieval
  async findAll(paginationOptions: { page?: number; limit?: number; all?: boolean }) {
    try {
      const { page, limit, all = false } = paginationOptions;

      if (all || (!page && !limit)) {
        const data = await this.prisma.transaction.findMany({
          include: this.includeOptionsWithUser,
        });

        const total = data.length;
        return {
          data,
          total,
        };
      }

      const currentPage = page || 1;
      const currentLimit = limit || 10;
      const skip = (currentPage - 1) * currentLimit;

      const data = await this.prisma.transaction.findMany({
        skip,
        take: currentLimit,
        include: this.includeOptionsWithUser,
      });

      const total = await this.prisma.transaction.count();

      return {
        data,
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages: Math.ceil(total / currentLimit),
      };
    } catch (error) {
      console.error("Error in findAll service:", error);
      throw new BadRequestException("Failed to fetch transactions");
    }
  }

  // Find all transactions by user ID with pagination and optional full retrieval (sin `user`)
  async findAllByUserId(userId: number, paginationOptions: { page?: number; limit?: number; all?: boolean }) {
    try {
      const { page, limit, all = false } = paginationOptions;

      if (all || (!page && !limit)) {
        const transactions = await this.prisma.transaction.findMany({
          where: {
            user_id: userId,
          },
          include: this.baseIncludeOptions, // No incluye la relación `user`
        });

        const total = transactions.length;
        if (!transactions.length) throw new NotFoundException(`No transactions found for user ID ${userId}`);
        return {
          data: transactions,
          total,
        };
      }

      const currentPage = page || 1;
      const currentLimit = limit || 10;
      const skip = (currentPage - 1) * currentLimit;

      const transactions = await this.prisma.transaction.findMany({
        where: {
          user_id: userId,
        },
        skip,
        take: currentLimit,
        include: this.baseIncludeOptions, // No incluye la relación `user`
      });

      const total = await this.prisma.transaction.count({
        where: {
          user_id: userId,
        },
      });

      if (!transactions.length) throw new NotFoundException(`No transactions found for user ID ${userId}`);

      return {
        data: transactions,
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages: Math.ceil(total / currentLimit),
      };
    } catch (error) {
      console.error("Error in findAllByUserId service:", error);
      throw new BadRequestException("Failed to fetch transactions");
    }
  }
}
