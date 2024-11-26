import { Body, Controller, Get, Param, Post, Put, Req, UseGuards, ForbiddenException, InternalServerErrorException } from "@nestjs/common";
import { ClassificationService } from "./classification.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { CustomParseIntPipe } from "../pipes/custom-parse-int.pipe";
import { CreateClassificationDTO } from "./dto/create-classification.dto";
import { UpdateClassificationDTO } from "./dto/update-classification.dto";
import { IAuthenticatedRequest } from "../interfaces/auth/authenticated-request.interface";
import { Roles } from "src/auth/roles.decorator";

@ApiTags("Classification")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller("classification")
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

  @Get()
  @ApiOperation({ summary: "Get all classifications for the logged-in user based on their transactions" })
  @ApiResponse({ status: 200, description: "List of classifications related to the user's transactions" })
  async getAllClassifications(@Req() req: IAuthenticatedRequest) {
    const userId = req.user.userId;

    console.log("User ID:", userId);
    console.log("User:", req.user);

    try {
      const classifications = await this.classificationService.getClassificationsAndTransactionsForUser(userId);
      console.log("Classifications:", classifications);
      return classifications;
    } catch (error) {
      console.error("Error fetching classifications:", error);
      throw new InternalServerErrorException("Failed to fetch classifications and transactions.");
    }
  }

  @Get("admin")
  @Roles("admin")
  @ApiOperation({ summary: "Get all classifications (admin)" })
  @ApiResponse({ status: 200, description: "List of all classifications" })
  async getAllClassificationsAdmin() {
    return this.classificationService.getAllClassifications();
  }

  @Get(":classification_id")
  @ApiOperation({ summary: "Get one classification by ID" })
  @ApiResponse({ status: 200, description: "Classification found" })
  @ApiResponse({ status: 404, description: "Classification not found" })
  async getOneClassification(@Param("classification_id", CustomParseIntPipe) classificationId: number) {
    return this.classificationService.getOneClassification(classificationId);
  }

  @Post()
  @ApiOperation({ summary: "Create a new classification" })
  @ApiResponse({ status: 201, description: "Classification created" })
  async createClassification(@Body() createClassificationDto: CreateClassificationDTO) {
    return this.classificationService.createClassification(createClassificationDto);
  }

  @Put(":classification_id")
  @ApiOperation({ summary: "Update a classification" })
  @ApiResponse({ status: 200, description: "Classification updated" })
  @ApiResponse({
    status: 403,
    description: "Forbidden: User does not own the transaction related to this classification",
  })
  async updateClassification(
    @Param("classification_id", CustomParseIntPipe) classificationId: number,
    @Body() updateClassificationDto: UpdateClassificationDTO,
    @Req() req: IAuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    const canUpdate = await this.classificationService.canUserUpdateClassification(classificationId, userId);

    if (!canUpdate) {
      throw new ForbiddenException("You do not have permission to update this classification");
    }

    return this.classificationService.updateClassification(classificationId, updateClassificationDto);
  }
}
