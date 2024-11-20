import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { IAuthenticatedRequest } from "../interfaces/auth/authenticated-request.interface";
import { CustomParseIntPipe } from "../pipes/custom-parse-int.pipe";
import { UpdateCategoryDTO } from "./dto/update-category.dto";
import { CreateCategoryDTO } from "./dto/create-category.dto ";

@ApiTags("Category")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller("category")
export class CategoryController {
  constructor(readonly categoryService: CategoryService) { }

  // get all categories (only admin)
  @Get()
  @Roles("admin")
  @ApiOperation({ summary: "Get all categories" })
  @ApiResponse({ status: 200, description: "List of categories" })
  async findAll() {
    return this.categoryService.findAll();
  }

  // get all categories by user logged in (public and private)
  @Get("user")
  @ApiOperation({ summary: "Get all categories by user logged in" })
  @ApiResponse({ status: 200, description: "Listo of categories by user logged in" })
  async findAllCategoriesByUserLoggedIn(@Req() req: IAuthenticatedRequest) {
    const userId = req.user.userId;
    return this.categoryService.FindAllCategoriesByUserLoggedIn(userId);
  }

  // get one category by category id
  @Get(":category_id")
  @ApiOperation({ summary: "Get one category by category id" })
  @ApiResponse({ status: 200, description: "Category found" })
  @ApiResponse({ status: 404, description: "Category not found" })
  async findOne(@Param("category_id", CustomParseIntPipe) categoryId: number, @Req() req: IAuthenticatedRequest) {
    const userId = req.user.userId;
    return this.categoryService.findOne(categoryId, userId);
  }

  // Endpoint para crear una nueva categoría
  @Post()
  @ApiOperation({ summary: "Create a new category" })
  @ApiResponse({ status: 201, description: "Category created" })
  async createCategory(@Body() createCategoryDto: CreateCategoryDTO, @Req() req: IAuthenticatedRequest) {
    const userId = req.user.userId;
    const isAdmin = req.user.roles.includes("admin");

    return this.categoryService.createCategory(createCategoryDto, userId, isAdmin);
  }

  // Endpoint para actualizar una categoría existente
  @Put(":category_id")
  @ApiOperation({ summary: "Update a category" })
  @ApiResponse({ status: 200, description: "Category updated" })
  async updateCategory(
    @Param("category_id", CustomParseIntPipe) categoryId: number,
    @Body() updateCategoryDto: UpdateCategoryDTO,
    @Req() req: IAuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    const isAdmin = req.user.roles.includes("admin");
    return this.categoryService.updateCategory(categoryId, updateCategoryDto, userId, isAdmin);
  }
}
