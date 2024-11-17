import { TransactionService } from "./transaction.service";
import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { IAuthenticatedRequest } from "../interfaces/auth/authenticated-request.interface";
import { Roles } from "../auth/roles.decorator";

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
}
