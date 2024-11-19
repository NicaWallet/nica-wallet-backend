import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateCategoryDTO } from "./dto/update-category.dto";
import { CreateCategoryDTO } from "./dto/create-category.dto ";

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) { }

  //   get all categories
  async findAll() {
    return this.prisma.category.findMany();
  }

  // get all categories by user id
  async FindAllCategoriesByUserLoggedIn(userId: number) {
    const categories = this.prisma.category.findMany({
      where: {
        OR: [
          { user_id: userId }, // private categories
          { user_id: null },   // public categories
        ],
      },
    });

    if (!categories || (await categories).length === 0) {
      throw new BadRequestException("Categories not found");
    }

    return categories;
  }

  //   get category by id
  async findOne(categoryId: number, userId: number) {
    // Buscar la categoría por su ID
    const category = await this.prisma.category.findUnique({
      where: {
        category_id: categoryId,
      },
      include: {
        Budget: true,
        subcategories: true,
        Transaction: true,
      },
    });

    // Si no existe, lanzar excepción
    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    // Si la categoría es privada y no pertenece al usuario, lanzar excepción
    if (category.user_id !== null && category.user_id !== userId) {
      throw new ForbiddenException(`You do not have access to this category`);
    }

    // Devolver la categoría si es pública o pertenece al usuario
    return category;
  }

  // Método para crear una categoría
  async createCategory(createCategoryDto: CreateCategoryDTO, userId: number, isAdmin: boolean) {
    const { name } = createCategoryDto;

    // Determinar si la categoría es pública o privada
    const categoryUserId = isAdmin ? null : userId;

    // Verificar si ya existe una categoría con el mismo nombre para el usuario o una categoría pública
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        name,
        OR: [
          { user_id: categoryUserId },
          { user_id: null }, // Verifica también las categorías públicas
        ],
      },
    });

    if (existingCategory) {
      throw new BadRequestException(`A category with the name "${name}" already exists.`);
    }

    // Crear la categoría
    const category = await this.prisma.category.create({
      data: {
        name,
        user_id: categoryUserId,
      },
    });

    // Retornar el ID de la nueva categoría y un mensaje de éxito
    return {
      message: 'Category created successfully',
      category_id: category.category_id,
    };
  }

  // Método para actualizar una categoría
  async updateCategory(categoryId: number, updateCategoryDto: UpdateCategoryDTO, userId: number, isAdmin: boolean) {
    const { name } = updateCategoryDto;

    // Buscar la categoría por ID
    const category = await this.prisma.category.findUnique({
      where: { category_id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    // Verificar permisos para actualizar
    if (category.user_id === null) {
      // Es una categoría pública
      if (!isAdmin) {
        throw new ForbiddenException("Only admins can update public categories");
      }
    } else {
      // Es una categoría privada
      if (category.user_id !== userId) {
        throw new ForbiddenException("You do not have permission to update this category");
      }
    }

    // Actualizar la categoría
    const updatedCategory = await this.prisma.category.update({
      where: { category_id: categoryId },
      data: { name },
    });

    return {
      message: "Category updated",
      category_id: updatedCategory.category_id,
    };
  }
}
