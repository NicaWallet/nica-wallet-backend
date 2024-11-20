import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateClassificationDTO } from "./dto/create-classification.dto";
import { UpdateClassificationDTO } from "./dto/update-classification.dto";

@Injectable()
export class ClassificationService {
  constructor(private readonly prisma: PrismaService) { }

  async getClassificationsAndTransactionsForUser(userId: number) {
    return this.prisma.classification.findMany({
      where: {
        Transaction: {
          some: {
            user_id: userId,
          },
        },
      },
      include: {
        Transaction: true, // Incluye las transacciones relacionadas
        _count: true
      },
    });
  }

  async getAllClassifications() {
    return this.prisma.classification.findMany(
      {
        include: {
          Transaction: true,
          _count: true
        },
        
      },
    );
  }

  async getOneClassification(classificationId: number) {
    const classification = await this.prisma.classification.findUnique({
      where: { classification_id: classificationId },
      include: {
        Transaction: {
          include: {
            category: {
              include: {
                subcategories: true
              }
            }
          },
        },
        _count: true
      },
    });

    if (!classification) {
      throw new NotFoundException(`Classification with id ${classificationId} not found`);
    }

    return classification;
  }

  async createClassification(createClassificationDto: CreateClassificationDTO) {
    const { name } = createClassificationDto;

    const existingClassification = await this.prisma.classification.findFirst({
      where: { name },
    });

    if (existingClassification) {
      throw new BadRequestException(`A classification with the name "${name}" already exists.`);
    }

    const classification = await this.prisma.classification.create({
      data: { name },
    });

    return {
      message: 'Classification created successfully',
      classification_id: classification.classification_id,
    };
  }

  async canUserUpdateClassification(classificationId: number, userId: number): Promise<boolean> {
    const classification = await this.prisma.classification.findUnique({
      where: { classification_id: classificationId },
      include: {
        Transaction: {
          where: { user_id: userId },
        },
      },
    });

    return classification?.Transaction?.length > 0;
  }

  async updateClassification(classificationId: number, updateClassificationDto: UpdateClassificationDTO) {
    const { name } = updateClassificationDto;

    const classification = await this.prisma.classification.findUnique({
      where: { classification_id: classificationId },
    });

    if (!classification) {
      throw new NotFoundException(`Classification with id ${classificationId} not found`);
    }

    if (name && name !== classification.name) {
      const existingClassification = await this.prisma.classification.findFirst({
        where: {
          name,
          NOT: { classification_id: classificationId },
        },
      });

      if (existingClassification) {
        throw new BadRequestException(`A classification with the name "${name}" already exists.`);
      }
    }

    const updatedClassification = await this.prisma.classification.update({
      where: { classification_id: classificationId },
      data: { name },
    });

    return {
      message: 'Classification updated successfully',
      classification_id: updatedClassification.classification_id,
    };
  }
}
