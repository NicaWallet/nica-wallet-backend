import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { SubcategoryService } from "./subcategory.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { IAuthenticatedRequest } from "../interfaces/auth/authenticated-request.interface";
import { CustomParseIntPipe } from "../pipes/custom-parse-int.pipe";
import { CreateSubcategoryDTO } from "./dto/create-subcategory.dto";
import { UpdateSubcategoryDTO } from "./dto/update-subcategory.dto";
import { Roles } from "src/auth/roles.decorator";

@ApiTags("Subcategory")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller("subcategory")
export class SubcategoryController {
    constructor(private readonly subcategoryService: SubcategoryService) { }

    @Get()
    @ApiOperation({ summary: "Get all subcategories for the logged-in user" })
    @ApiResponse({ status: 200, description: "List of subcategories" })
    async getAllSubcategories(@Req() req: IAuthenticatedRequest) {
        const userId = req.user.userId;
        return this.subcategoryService.getAllSubcategories(userId);
    }

    @Get("admin")
    @Roles("admin")
    @ApiOperation({ summary: "Get all subcategories (admin)" })
    @ApiResponse({ status: 200, description: "List of all subcategories" })
    async getAllSubcategoriesAdmin() {
        return this.subcategoryService.getAllSubcategoriesAdmin();
    }

    @Get(":subcategory_id")
    @ApiOperation({ summary: "Get one subcategory by ID" })
    @ApiResponse({ status: 200, description: "Subcategory found" })
    @ApiResponse({ status: 404, description: "Subcategory not found" })
    async getOneSubcategory(@Param("subcategory_id", CustomParseIntPipe) subcategoryId: number, @Req() req: IAuthenticatedRequest) {
        const userId = req.user.userId;
        const isAdmin = req.user.roles.includes("admin");
        return this.subcategoryService.getOneSubcategory(subcategoryId, userId, isAdmin);
    }

    @Post()
    @ApiOperation({ summary: "Create a new subcategory" })
    @ApiResponse({ status: 201, description: "Subcategory created" })
    async createSubcategory(@Body() createSubcategoryDto: CreateSubcategoryDTO, @Req() req: IAuthenticatedRequest) {
        const userId = req.user.userId;
        const isAdmin = req.user.roles.includes("admin");
        return this.subcategoryService.createSubcategory(createSubcategoryDto, userId, isAdmin);
    }

    @Put(":subcategory_id")
    @ApiOperation({ summary: "Update a subcategory" })
    @ApiResponse({ status: 200, description: "Subcategory updated" })
    async updateSubcategory(@Param("subcategory_id", CustomParseIntPipe) subcategoryId: number, @Body() updateSubcategoryDto: UpdateSubcategoryDTO, @Req() req: IAuthenticatedRequest) {
        const userId = req.user.userId;
        const isAdmin = req.user.roles.includes("admin");
        return this.subcategoryService.updateSubcategory(subcategoryId, updateSubcategoryDto, userId, isAdmin);
    }
}
