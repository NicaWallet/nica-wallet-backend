import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { Prisma } from "@prisma/client";
import { UpdateTransactionDto } from "./dto/ update-transaction.dto";

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

      const selectFields = {
        transaction_id: true,
        amount: true,
        date: true,
        category: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
          },
        },
        classification: {
          select: {
            name: true,
          },
        },
        created_at: true,
        updated_at: true,
      };

      if (all || (!page && !limit)) {
        const transactions = await this.prisma.transaction.findMany({
          where: {
            user_id: userId,
          },
          select: selectFields,
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
        select: selectFields,
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

  /**
   * Creates a new transaction associated with the given user ID.
   * Validates the existence of the category, subcategory, and classification.
   * @param userId - The ID of the user creating the transaction.
   * @param createTransactionDto - DTO containing transaction data.
   * @returns An object with a success message and transaction details.
   * @throws NotFoundException if any of the related entities are not found.
   */
  async createTransaction(userId: number, createTransactionDto: CreateTransactionDto) {
    const { category_id, subcategory_id, classification_id, amount } = createTransactionDto;

    // Validar la existencia de la categoría
    const category = await this.prisma.category.findUnique({ where: { category_id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${category_id} not found`);
    }

    // Validar la existencia de la subcategoría
    const subcategory = await this.prisma.subcategory.findUnique({ where: { subcategory_id } });
    if (!subcategory) {
      throw new NotFoundException(`Subcategory with ID ${subcategory_id} not found`);
    }

    // Validar la existencia de la clasificación
    const classification = await this.prisma.classification.findUnique({ where: { classification_id } });
    if (!classification) {
      throw new NotFoundException(`Classification with ID ${classification_id} not found`);
    }

    // Crear la transacción
    const transaction = await this.prisma.transaction.create({
      data: {
        user_id: userId, // Obtiene el user_id del token
        amount,
        category_id,
        subcategory_id,
        classification_id,
        date: new Date(), // Incluye la fecha si es necesaria
      } as Prisma.TransactionUncheckedCreateInput,
    });

    return {
      message: "Transaction created successfully",
      transaction,
    };
  }

  /**
   * Updates a transaction if the user is the owner.
   * @param transactionId - The ID of the transaction to update.
   * @param userId - The ID of the user attempting the update.
   * @param updateTransactionDto - DTO containing the updated data.
   * @returns The updated transaction.
   * @throws NotFoundException if the transaction does not exist.
   * @throws ForbiddenException if the user is not the owner of the transaction.
   */
  async updateTransaction(transactionId: number, userId: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { transaction_id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${transactionId} not found`);
    }

    if (transaction.user_id !== userId) {
      throw new ForbiddenException(`You do not have permission to update this transaction`);
    }

    // Validaciones opcionales de entidades relacionadas
    if (updateTransactionDto.category_id) {
      const category = await this.prisma.category.findUnique({ where: { category_id: updateTransactionDto.category_id } });
      if (!category) {
        throw new NotFoundException(`Category with ID ${updateTransactionDto.category_id} not found`);
      }
    }

    if (updateTransactionDto.subcategory_id) {
      const subcategory = await this.prisma.subcategory.findUnique({ where: { subcategory_id: updateTransactionDto.subcategory_id } });
      if (!subcategory) {
        throw new NotFoundException(`Subcategory with ID ${updateTransactionDto.subcategory_id} not found`);
      }
    }

    if (updateTransactionDto.classification_id) {
      const classification = await this.prisma.classification.findUnique({ where: { classification_id: updateTransactionDto.classification_id } });
      if (!classification) {
        throw new NotFoundException(`Classification with ID ${updateTransactionDto.classification_id} not found`);
      }
    }

    // Verifica si el campo `date` se debe actualizar
    if (updateTransactionDto.date && isNaN(Date.parse(updateTransactionDto.date))) {
      throw new BadRequestException("Invalid date format");
    }

    const updatedTransaction = await this.prisma.transaction.update({
      where: { transaction_id: transactionId },
      data: {
        ...updateTransactionDto,
        date: updateTransactionDto.date ? new Date(updateTransactionDto.date) : undefined,
      },
    });

    return {
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    };
  }

  /**
   * Deletes a transaction if the user is the owner.
   * @param transactionId - The ID of the transaction to delete.
   * @param userId - The ID of the user attempting the deletion.
   * @returns A confirmation message on successful deletion.
   * @throws NotFoundException if the transaction does not exist.
   * @throws ForbiddenException if the user is not the owner of the transaction.
   */
  async deleteTransaction(transactionId: number, userId: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { transaction_id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${transactionId} not found`);
    }

    if (transaction.user_id !== userId) {
      throw new ForbiddenException(`You do not have permission to delete this transaction`);
    }

    await this.prisma.transaction.delete({
      where: { transaction_id: transactionId },
    });

    return {
      message: "Transaction deleted successfully",
    };
  }

  /**
   * Retrieves the details of a transaction, including related entities and history.
   * @param transactionId - The ID of the transaction to retrieve.
   * @param userId - The ID of the user requesting the details.
   * @returns The transaction details.
   * @throws NotFoundException if the transaction does not exist.
   * @throws ForbiddenException if the user is not the owner of the transaction.
   */
  async getTransactionDetails(transactionId: number, userId: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { transaction_id: transactionId },
      include: this.includeOptionsWithUser, // Utiliza la configuración existente
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${transactionId} not found`);
    }

    if (transaction.user_id !== userId) {
      throw new ForbiddenException(`You do not have permission to access this transaction`);
    }

    return transaction;
  }
}
