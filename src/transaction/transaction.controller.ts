import { TransactionService } from "./transaction.service";
import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { IAuthenticatedRequest } from "../interfaces/auth/authenticated-request.interface";
import { Roles } from "../auth/roles.decorator";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/ update-transaction.dto";
import { CustomParseIntPipe } from "../pipes/custom-parse-int.pipe";

@ApiTags("Transaction")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller("transaction")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // Find all transactions
  @Get()
  @Roles("admin")
  @ApiOperation({ summary: "Get all transactions" })
  @ApiResponse({ status: 200, description: "List of all transactions." })
  async findAll(@Query("page") page?: number, @Query("limit") limit?: number, @Query("all") all: boolean = false) {
    if (!page && !limit) {
      all = true; // Si no se envían page y limit, se establece `all` en true
    }
    return this.transactionService.findAll({ page, limit, all });
  }

  // Find all transactions by user id
  @Get("user")
  @ApiOperation({ summary: "Get all transactions by user id" })
  @ApiResponse({ status: 200, description: "List of all transactions by user logged in." })
  async findAllByUserId(@Req() req: IAuthenticatedRequest, @Query("page") page?: number, @Query("limit") limit?: number, @Query("all") all: boolean = false) {
    const userId = req.user.userId;
    if (!page && !limit) {
      all = true; // Si no se envían page y limit, se establece `all` en true
    }
    return this.transactionService.findAllByUserId(userId, { page, limit, all });
  }

  @Post()
  @ApiOperation({
    summary: "Create a new transaction",
    description: "Endpoint to create a new transaction associated with the authenticated user.",
  })
  @ApiResponse({ status: 201, description: "Transaction created successfully." })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 404, description: "Category, Subcategory, or Classification not found" })
  async createTransaction(@Req() req: IAuthenticatedRequest, @Body() createTransactionDto: CreateTransactionDto) {
    const userId = req.user.userId;
    return this.transactionService.createTransaction(userId, createTransactionDto);
  }

  @Put(":transaction_id")
  @ApiOperation({
    summary: "Update an existing transaction",
    description: "Allows the authenticated user to update any field of a transaction they own.",
  })
  @ApiResponse({ status: 200, description: "Transaction updated successfully." })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 403, description: "Forbidden: User is not the owner of the transaction" })
  @ApiResponse({ status: 404, description: "Transaction not found" })
  async updateTransaction(@Param("transaction_id", ParseIntPipe) transactionId: number, @Req() req: IAuthenticatedRequest, @Body() updateTransactionDto: UpdateTransactionDto) {
    const userId = req.user.userId; // Obtiene el userId del token decodificado
    return this.transactionService.updateTransaction(transactionId, userId, updateTransactionDto);
  }

  @Delete(":transaction_id")
  @ApiOperation({
    summary: "Delete an existing transaction",
    description: "Allows the authenticated user to delete a transaction they own.",
  })
  @ApiResponse({ status: 200, description: "Transaction deleted successfully." })
  @ApiResponse({ status: 403, description: "Forbidden: User is not the owner of the transaction" })
  @ApiResponse({ status: 404, description: "Transaction not found" })
  async deleteTransaction(@Param("transaction_id", CustomParseIntPipe) transactionId: number, @Req() req: IAuthenticatedRequest) {
    const userId = req.user.userId; // Obtiene el userId del token decodificado
    return this.transactionService.deleteTransaction(transactionId, userId);
  }

  @Get(":transaction_id")
  @ApiOperation({
    summary: "Get details of a specific transaction",
    description: "Retrieves detailed information of a transaction including its relations and history.",
  })
  @ApiResponse({ status: 200, description: "Transaction details retrieved successfully." })
  @ApiResponse({ status: 403, description: "Forbidden: User is not the owner of the transaction" })
  @ApiResponse({ status: 404, description: "Transaction not found" })
  async getTransactionDetails(@Param("transaction_id", CustomParseIntPipe) transactionId: number, @Req() req: IAuthenticatedRequest) {
    const userId = req.user.userId; // Obtiene el userId del token decodificado
    return this.transactionService.getTransactionDetails(transactionId, userId);
  }

  @Get(":transaction_id/history")
  @ApiOperation({
    summary: "Get history of a specific transaction",
    description: "Retrieves the history of changes for a specific transaction.",
  })
  @ApiResponse({ status: 200, description: "Transaction history retrieved successfully." })
  @ApiResponse({ status: 403, description: "Forbidden: User is not the owner of the transaction" })
  @ApiResponse({ status: 404, description: "Transaction not found" })
  async getTransactionHistory(@Param("transaction_id", CustomParseIntPipe) transactionId: number, @Req() req: IAuthenticatedRequest) {
    const userId = req.user.userId; // Obtiene el userId del token decodificado
    return this.transactionService.getTransactionHistory(transactionId, userId);
  }
}
