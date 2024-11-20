import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSubcategoryDTO } from "./dto/create-subcategory.dto";
import { UpdateSubcategoryDTO } from "./dto/update-subcategory.dto";

@Injectable()
export class SubcategoryService {
    constructor(private readonly prisma: PrismaService) { }

    // Obtener todas las subcategorías para un usuario
    async getAllSubcategories(userId: number) {
        return this.prisma.subcategory.findMany({
            where: {
                OR: [
                    { user_id: userId }, // Subcategorías del usuario
                    { user_id: null },   // Subcategorías públicas
                ],
            },
            include: {
                category: true,
            },
        });
    }

    // Obtener todas las subcategorías (admin)
    async getAllSubcategoriesAdmin() {
        return this.prisma.subcategory.findMany({
            include: {
                category: true,
            },
        });
    }

    // Obtener una subcategoría por ID
    async getOneSubcategory(subcategoryId: number, userId: number, isAdmin: boolean) {
        const subcategory = await this.prisma.subcategory.findUnique({
            where: { subcategory_id: subcategoryId },
            include: { category: true },
        });

        if (!subcategory) {
            throw new NotFoundException(`Subcategory with id ${subcategoryId} not found`);
        }

        if (subcategory.user_id !== null && subcategory.user_id !== userId && !isAdmin) {
            throw new ForbiddenException("You do not have access to this subcategory");
        }

        return subcategory;
    }

    // Crear una subcategoría
    async createSubcategory(createSubcategoryDto: CreateSubcategoryDTO, userId: number, isAdmin: boolean) {
        const { name, category_id } = createSubcategoryDto;

        // Verificar que el category_id existe en la base de datos
        const categoryExists = await this.prisma.category.findUnique({
            where: { category_id },
        });

        if (!categoryExists) {
            throw new BadRequestException(`Category with id ${category_id} does not exist.`);
        }

        // Determinar si la subcategoría es pública o privada
        const subcategoryUserId = isAdmin ? null : userId;

        // Verificar si ya existe una subcategoría con el mismo nombre para el usuario o pública
        const existingSubcategory = await this.prisma.subcategory.findFirst({
            where: {
                name,
                category_id,
                OR: [
                    { user_id: subcategoryUserId },
                    { user_id: null },
                ],
            },
        });

        if (existingSubcategory) {
            throw new BadRequestException(`A subcategory with the name "${name}" already exists.`);
        }

        // Crear la subcategoría
        const subcategory = await this.prisma.subcategory.create({
            data: {
                name,
                category_id,
                user_id: subcategoryUserId,
            },
        });

        return {
            message: 'Subcategory created successfully',
            subcategory_id: subcategory.subcategory_id,
        };
    }


    // Actualizar una subcategoría
    async updateSubcategory(subcategoryId: number, updateSubcategoryDto: UpdateSubcategoryDTO, userId: number, isAdmin: boolean) {
        const { name } = updateSubcategoryDto;

        // Buscar la subcategoría por ID
        const subcategory = await this.prisma.subcategory.findUnique({
            where: { subcategory_id: subcategoryId },
        });

        if (!subcategory) {
            throw new NotFoundException(`Subcategory with id ${subcategoryId} not found`);
        }

        // Verificar permisos para actualizar
        if (subcategory.user_id === null) {
            if (!isAdmin) {
                throw new ForbiddenException("Only admins can update public subcategories");
            }
        } else {
            if (subcategory.user_id !== userId) {
                throw new ForbiddenException("You do not have permission to update this subcategory");
            }
        }

        if (!name || name.length < 3 || name.length > 50) {
            throw new BadRequestException("Name must be between 3 and 50 characters long");
        }
        
        // Verificar si el nuevo nombre ya está en uso por otra subcategoría
        if (name && name !== subcategory.name) {
            const existingSubcategory = await this.prisma.subcategory.findFirst({
                where: {
                    name,
                    category_id: subcategory.category_id,
                    OR: [
                        { user_id: subcategory.user_id },
                        { user_id: null },
                    ],
                    NOT: {
                        subcategory_id: subcategoryId,
                    },
                },
            });

            if (existingSubcategory) {
                throw new BadRequestException(`A subcategory with the name "${name}" already exists.`);
            }
        }

        // Actualizar la subcategoría
        const updatedSubcategory = await this.prisma.subcategory.update({
            where: { subcategory_id: subcategoryId },
            data: { name },
        });

        return {
            message: 'Subcategory updated successfully',
            subcategory_id: updatedSubcategory.subcategory_id,
        };
    }
}
