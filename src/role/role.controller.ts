import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { RoleService } from './role.service';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Role')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('role')
@ApiBearerAuth()
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    // Obtener todos los roles disponibles
    @Get()
    async findAll() {
        return this.roleService.findAll();
    }

    // Get role by id
    @Get(':id')
    @Roles('admin')
    @ApiOperation({ summary: 'Get a role by ID' })
    @ApiResponse({ status: 200, description: 'Role data.' })
    @ApiResponse({ status: 404, description: 'Role not found.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async findOne(@Param('id') id: string) {
        return this.roleService.findOne(Number(id));
    }
}
