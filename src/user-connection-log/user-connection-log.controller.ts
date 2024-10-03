import { Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UserConnectionLogService } from './user-connection-log.service';
import { PermissionsGuard } from '../permission/permissions.guard'; // Importar el guardián
import { Permission } from '../permission/permission.decorator'; // Importar el decorador de permiso
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('User Connection Log')
@Controller('user-connection-log')
@UseGuards(JwtAuthGuard, PermissionsGuard) // Aplicar el guardián a nivel de controlador
export class UserConnectionLogController {
    constructor(private readonly userConnectionLogService: UserConnectionLogService) { }

    @Get()
    @ApiOperation({ summary: 'Get all user connection logs (paginated or all)' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
    @ApiQuery({ name: 'all', required: false, type: Boolean, description: 'Return all records, ignoring pagination' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('all') all?: boolean,
    ) {
        return this.userConnectionLogService.findAll(page, limit, all);
    }


    @Get(':userId')
    @Permission('READ') // Solo usuarios con permiso 'READ' pueden acceder
    @ApiOperation({ summary: 'Get connection logs by user ID' })
    @ApiResponse({ status: 200, description: 'User connection logs retrieved successfully.' })
    async findByUserId(@Param('userId') userId: number) {
        return this.userConnectionLogService.findByUserId(userId);
    }

    @Get('log/:connectionId')
    @Permission('READ') // Solo usuarios con permiso 'READ' pueden acceder
    @ApiOperation({ summary: 'Get a specific connection log by ID' })
    @ApiResponse({ status: 200, description: 'Connection log retrieved successfully.' })
    async findOne(@Param('connectionId') connectionId: number) {
        return this.userConnectionLogService.findOne(connectionId);
    }

    @Delete(':connectionId')
    @Permission('DELETE') // Solo usuarios con permiso 'DELETE' pueden acceder
    @ApiOperation({ summary: 'Delete a specific connection log' })
    @ApiResponse({ status: 200, description: 'Connection log deleted successfully.' })
    async remove(@Param('connectionId') connectionId: number) {
        return this.userConnectionLogService.remove(connectionId);
    }

    @Patch(':connectionId/logout')
    @Permission('WRITE') // Solo usuarios con permiso 'WRITE' pueden acceder
    @ApiOperation({ summary: 'Update the logout time of a connection log' })
    @ApiResponse({ status: 200, description: 'Logout time updated successfully.' })
    async updateLogoutTime(@Param('connectionId') connectionId: number) {
        return this.userConnectionLogService.updateLogoutTime(connectionId);
    }

    @Get('filter')
    @Permission('READ') // Solo usuarios con permiso 'READ' pueden acceder
    @ApiOperation({ summary: 'Filter connection logs by date range' })
    @ApiResponse({ status: 200, description: 'Connection logs filtered by date range.' })
    @ApiQuery({ name: 'start', required: true, type: String, description: 'Start date' })
    @ApiQuery({ name: 'end', required: true, type: String, description: 'End date' })
    async filterByDateRange(
        @Query('start') start: string,
        @Query('end') end: string
    ) {
        return this.userConnectionLogService.filterByDateRange(new Date(start), new Date(end));
    }

    @Get('latest/:limit')
    @Permission('READ') // Solo usuarios con permiso 'READ' pueden acceder
    @ApiOperation({ summary: 'Get the latest connection logs' })
    @ApiResponse({ status: 200, description: 'Latest connection logs retrieved successfully.' })
    async findLatest(@Param('limit') limit: number) {
        return this.userConnectionLogService.findLatest(limit);
    }

    @Get('count')
    @Permission('READ') // Solo usuarios con permiso 'READ' pueden acceder
    @ApiOperation({ summary: 'Count the total number of connection logs' })
    @ApiResponse({ status: 200, description: 'Total count of connection logs.' })
    async countLogs() {
        return this.userConnectionLogService.countLogs();
    }
}
