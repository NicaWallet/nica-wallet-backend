import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { BudgetService } from "./budget.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CreateBudgetDto } from "./dto/create-budget.dto";
import { UpdateBudgetDto } from "./dto/update-budget.dto";
import { IAuthenticatedRequest } from "../interfaces/auth/authenticated-request.interface";
import { Roles } from "../auth/roles.decorator";
import { GetActiveBudgetsDto } from "./dto/get-active-budgets.dto";

@ApiTags("Budget")
@Controller("budget")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BudgetController {
  constructor(private readonly BudgetService: BudgetService) {}

  // Find all budgets
  @Get()
  @Roles("admin")
  @ApiOperation({ summary: "Get all budgets" })
  @ApiResponse({ status: 200, description: "List of all budgets." })
  findAll() {
    return this.BudgetService.findAll();
  }

  // Find all budgets by user id
  @Get("user")
  @ApiOperation({ summary: "Get all budgets by user id" })
  @ApiResponse({ status: 200, description: "List of all budgets by user id." })
  findAllByUserId(@Req() req: IAuthenticatedRequest) {
    const userId = req.user.userId;
    // console.log(`Fetching budgets for user ID: ${userId}`);
    return this.BudgetService.findAllByUserId(userId);
  }

  // Find one budget by id
  @Get(":id")
  @ApiOperation({ summary: "Get a budget by id" })
  @ApiResponse({ status: 200, description: "Budget retrieved successfully." })
  findOne(@Param("id", ParseIntPipe) id: number) {
    // console.log(`Fetching budget with ID: ${id}`);
    return this.BudgetService.findOne(id);
  }

  // Get remaining budget for a specific category or total
  @Get("remaining/:categoryId")
  @ApiOperation({ summary: "Get remaining budget for a specific category or total" })
  @ApiResponse({ status: 200, description: "Remaining budget for the specified category" })
  getRemainingBudget(@Param("categoryId", ParseIntPipe) categoryId: number, @Req() req: IAuthenticatedRequest) {
    const userId = req.user.userId;
    console.log(`Fetching remaining budget for category ID: ${categoryId} for user ID: ${userId}`);
    return this.BudgetService.getRemainingBudget(userId, categoryId);
  }

  // Create a new budget
  @Post()
  @ApiOperation({ summary: "Create a new budget" })
  @ApiResponse({ status: 201, description: "Budget created successfully" })
  create(@Body() createBudgetDto: CreateBudgetDto, @Req() req: IAuthenticatedRequest) {
    const userId = req.user.userId; // Obtiene el userId del token decodificado
    console.log(`Creating budget for user ID: ${userId}`);
    return this.BudgetService.createBudget(createBudgetDto, userId);
  }

  // Get active budgets within a specific date range
  @Post("active")
  @Roles("admin")
  @ApiOperation({ summary: "Get all active budgets within a specific date range" })
  @ApiResponse({ status: 200, description: "List of active budgets" })
  getActiveBudgets(@Body() body: GetActiveBudgetsDto) {
    const { startDate, endDate } = body;
    console.log(`Received startDate: ${startDate}, endDate: ${endDate}`);

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      console.error("Invalid date format");
      throw new BadRequestException("Invalid date format. Please provide valid start and end dates.");
    }

    return this.BudgetService.findActiveBudgets(parsedStartDate, parsedEndDate);
  }

  // Get active budgets within a specific date range by user id
  @Post("active/user")
  @ApiOperation({ summary: "Get all active budgets within a specific date range by user logged in" })
  @ApiResponse({ status: 200, description: "List of active budgets" })
  getActiveBudgetsByUserId(@Body() body: GetActiveBudgetsDto, @Req() req: IAuthenticatedRequest) {
    const userId = req.user.userId;
    if (isNaN(userId)) {
      throw new BadRequestException("Invalid user ID");
    }

    const { startDate, endDate } = body;
    console.log(`Received startDate: ${startDate}, endDate: ${endDate} for user ID: ${userId}`);

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      console.error("Invalid date format");
      throw new BadRequestException("Invalid date format. Please provide valid start and end dates.");
    }

    return this.BudgetService.findActiveBudgetsByUserId(parsedStartDate, parsedEndDate, userId);
  }

  // Duplicate a budget
  @Post("duplicate/:id")
  @ApiOperation({ summary: "Duplicate a budget" })
  @ApiResponse({ status: 201, description: "Budget duplicated successfully" })
  duplicateBudget(@Param("id", ParseIntPipe) budgetId: number, @Req() req: IAuthenticatedRequest) {
    const userId = req.user.userId;
    console.log(`Duplicating budget with ID: ${budgetId} for user ID: ${userId}`);
    return this.BudgetService.duplicateBudget(budgetId, userId);
  }

  // Update an existing budget
  @Put(":id")
  @ApiOperation({ summary: "Update an existing budget" })
  @ApiResponse({ status: 200, description: "Budget updated successfully" })
  @ApiResponse({ status: 404, description: "Budget not found or does not belong to the user" })
  update(@Param("id", ParseIntPipe) budgetId: number, @Body() updateBudgetDto: UpdateBudgetDto, @Req() req: IAuthenticatedRequest) {
    const userId = req.user.userId; // Obtiene el userId del token decodificado
    console.log(`Updating budget with ID: ${budgetId} for user ID: ${userId}`);
    return this.BudgetService.updateBudget(budgetId, updateBudgetDto, userId);
  }

  // Delete an existing budget
  @Delete(":id")
  @ApiOperation({ summary: "Delete an existing budget" })
  @ApiResponse({ status: 200, description: "Budget deleted successfully" })
  @ApiResponse({ status: 404, description: "Budget not found or does not belong to the user" })
  delete(@Param("id", ParseIntPipe) budgetId: number, @Req() req: IAuthenticatedRequest) {
    const userId = req.user.userId; // Obtiene el userId del token decodificado
    console.log(`Deleting budget with ID: ${budgetId} for user ID: ${userId}`);
    return this.BudgetService.deleteBudget(budgetId, userId);
  }
}
