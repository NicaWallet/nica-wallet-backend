import { Controller, Get, Param, Req, UseGuards, ForbiddenException } from "@nestjs/common";
import { HistoryService } from "./history.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { CustomParseIntPipe } from "../pipes/custom-parse-int.pipe";
import { IAuthenticatedRequest } from "../interfaces/auth/authenticated-request.interface";

@ApiTags("History")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller("history")
export class HistoryController {
    constructor(private readonly historyService: HistoryService) { }

    @Get()
    @ApiOperation({ summary: "Get all history records related to the user's transactions" })
    @ApiResponse({ status: 200, description: "List of history records related to the user's transactions" })
    async getAllHistoryForUser(@Req() req: IAuthenticatedRequest) {
        const userId = req.user.userId;
        return this.historyService.getAllHistoryForUserTransactions(userId);
    }

    @Get("admin")
    @Roles("admin")
    @ApiOperation({ summary: "Get all history records (admin)" })
    @ApiResponse({ status: 200, description: "List of all history records" })
    async getAllHistoryAdmin() {
        return this.historyService.getAllHistory();
    }

    @Get(":history_id")
    @ApiOperation({ summary: "Get one history record by ID" })
    @ApiResponse({ status: 200, description: "History record found" })
    @ApiResponse({ status: 404, description: "History record not found" })
    async getOneHistory(@Param("history_id", CustomParseIntPipe) historyId: number, @Req() req: IAuthenticatedRequest) {
        const userId = req.user.userId;
        return this.historyService.getOneHistory(historyId, userId);
    }
}
