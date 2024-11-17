import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBudgetDto } from "./dto/create-budget.dto";
import { UpdateBudgetDto } from "./dto/update-budget.dto";

@Injectable()
export class BudgetService {
  constructor(private readonly prisma: PrismaService) {}

  // Servicio para obtener todos los presupuestos
  async findAll() {
    return this.prisma.budget.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
  }

  // Servicio para obtener un presupuesto por ID
  async findOne(id: number) {
    const parsedId = typeof id === "string" ? parseInt(id, 10) : id;
    if (isNaN(parsedId)) {
      throw new BadRequestException("Invalid ID");
    }

    const budget = await this.prisma.budget.findUnique({
      where: {
        budget_id: parsedId,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }

    return budget;
  }

  // Servicio para obtener todos los presupuestos de un usuario
  async findAllByUserId(userId: number) {
    const parsedUserId = typeof userId === "string" ? parseInt(userId, 10) : userId;

    const budgets = await this.prisma.budget.findMany({
      where: {
        user_id: parsedUserId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!budgets.length) {
      throw new NotFoundException(`No budgets found for user ID ${userId}`);
    }

    return budgets;
  }

  // Servicio para crear un presupuesto
  async createBudget(createBudgetDto: CreateBudgetDto, userId: number) {
    // Validar si la fecha de inicio es mayor que la de finalización
    if (new Date(createBudgetDto.start_date) > new Date(createBudgetDto.end_date)) {
      throw new BadRequestException("Start date cannot be later than end date.");
    }

    // Verificar si la cantidad es positiva
    if (createBudgetDto.amount <= 0) {
      throw new BadRequestException("Amount must be greater than zero.");
    }

    // Verificar si la categoría existe
    const category = await this.prisma.category.findUnique({
      where: { category_id: createBudgetDto.category_id },
    });

    if (!category) {
      throw new BadRequestException(`Category with ID ${createBudgetDto.category_id} does not exist`);
    }

    // Verificar si el usuario existe y está activo
    const user = await this.prisma.user.findUnique({ where: { user_id: userId } });
    if (!user) {
      throw new BadRequestException("User does not exist.");
    }
    if (user.status !== "active") {
      throw new ForbiddenException("User is not active.");
    }

    // Verificar si ya existe un presupuesto con la misma categoría y rango de fechas
    const existingBudget = await this.prisma.budget.findFirst({
      where: {
        user_id: userId,
        category_id: createBudgetDto.category_id,
        start_date: createBudgetDto.start_date,
        end_date: createBudgetDto.end_date,
      },
    });

    if (existingBudget) {
      throw new BadRequestException("A budget with the same category and date range already exists.");
    }

    // Crear el presupuesto
    return this.prisma.budget.create({
      data: {
        ...createBudgetDto,
        user_id: userId,
      },
    });
  }

  // Servicio para actualizar un presupuesto
  async updateBudget(budgetId: number, updateBudgetDto: UpdateBudgetDto, userId: number) {
    const budget = await this.prisma.budget.findUnique({
      where: { budget_id: budgetId },
    });

    if (!budget || budget.user_id !== userId) {
      throw new NotFoundException(`Budget with ID ${budgetId} not found or does not belong to the user`);
    }

    // Validar si la fecha de inicio es mayor que la de finalización
    if (updateBudgetDto.start_date && updateBudgetDto.end_date) {
      if (new Date(updateBudgetDto.start_date) > new Date(updateBudgetDto.end_date)) {
        throw new BadRequestException("Start date cannot be later than end date.");
      }
    }

    // Verificar si la cantidad es positiva
    if (updateBudgetDto.amount !== undefined && updateBudgetDto.amount <= 0) {
      throw new BadRequestException("Amount must be greater than zero.");
    }

    // Verificar si la categoría existe si se está actualizando
    if (updateBudgetDto.category_id) {
      const category = await this.prisma.category.findUnique({
        where: { category_id: updateBudgetDto.category_id },
      });

      if (!category) {
        throw new BadRequestException(`Category with ID ${updateBudgetDto.category_id} does not exist`);
      }
    }

    return this.prisma.budget.update({
      where: { budget_id: budgetId },
      data: updateBudgetDto,
    });
  }

  // Servicio para eliminar un presupuesto
  async deleteBudget(budgetId: number, userId: number) {
    const budget = await this.prisma.budget.findUnique({
      where: { budget_id: budgetId },
    });

    if (!budget || budget.user_id !== userId) {
      throw new NotFoundException(`Budget with ID ${budgetId} not found or does not belong to the user`);
    }

    return this.prisma.budget.delete({
      where: { budget_id: budgetId },
    });
  }

  // Servicio para obtener presupuestos activos en un rango de fechas
  async findActiveBudgets(startDate: Date, endDate: Date) {
    console.log(`Querying active budgets from ${startDate} to ${endDate}`);

    if (startDate > endDate) {
      throw new BadRequestException("Start date cannot be later than end date for active budgets.");
    }

    const activeBudgets = await this.prisma.budget.findMany({
      where: {
        start_date: { gte: startDate },
        end_date: { lte: endDate },
      },
      orderBy: {
        start_date: "asc",
      },
    });

    if (!activeBudgets.length) {
      throw new NotFoundException("No active budgets found within the specified date range.");
    }

    return activeBudgets;
  }

  async findActiveBudgetsByUserId(startDate: Date, endDate: Date, userId: number) {
    console.log(`Querying active budgets from ${startDate} to ${endDate} for user ID: ${userId}`);

    if (startDate > endDate) {
      throw new BadRequestException("Start date cannot be later than end date for active budgets.");
    }

    const activeBudgets = await this.prisma.budget.findMany({
      where: {
        user_id: userId,
        start_date: { gte: startDate },
        end_date: { lte: endDate },
      },
      orderBy: {
        start_date: "asc",
      },
    });

    if (!activeBudgets.length) {
      throw new NotFoundException(`No active budgets found within the specified date range for user ID ${userId}`);
    }

    return activeBudgets;
  }

  // Servicio para obtener el presupuesto restante por categoría
  async getRemainingBudget(userId: number, categoryId: number) {
    const parsedCategoryId = typeof categoryId === "string" ? parseInt(categoryId, 10) : categoryId;

    const budgets = await this.prisma.budget.findMany({
      where: {
        user_id: userId,
        category_id: parsedCategoryId,
      },
    });

    if (!budgets.length) {
      throw new NotFoundException(`No budgets found for user ID ${userId} and category ID ${categoryId}`);
    }

    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);

    // TODO: Mejorar la lógica para calcular el gasto real y obtener el presupuesto restante
    // Aquí puedes implementar lógica adicional para calcular el gasto real y obtener el presupuesto restante
    // const totalSpent = ...
    // const remainingBudget = totalBudget - totalSpent;

    return {
      categoryId,
      totalBudget,
      remainingBudget: totalBudget, // Suponer que el presupuesto total es el presupuesto restante por simplicidad
    };
  }

  // Servicio para duplicar un presupuesto
  async duplicateBudget(budgetId: number, userId: number) {
    const budget = await this.prisma.budget.findUnique({
      where: { budget_id: budgetId },
    });

    if (!budget || budget.user_id !== userId) {
      throw new NotFoundException(`Budget with ID ${budgetId} not found or does not belong to the user`);
    }

    const newBudget = { ...budget, budget_id: undefined, created_at: new Date(), updated_at: new Date() };

    return this.prisma.budget.create({
      data: newBudget,
    });
  }
}
