import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRoleService } from './user-role.service';
import { Roles } from 'src/auth/roles.decorator';
import { UserResponseDto } from './dto/user-role-response.dto';

@ApiTags('User-role')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user-role')
@ApiBearerAuth()
export class UserRoleController {
    constructor(private readonly userRoleService: UserRoleService) { }

    // Obtener todos los roles disponibles
    @Roles('admin')
    @ApiOperation({ summary: 'Get all user roles' })
    @ApiResponse({ status: 200, description: 'List of all user roles.', type: UserResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @Get()
    async findAll() {
        return this.userRoleService.findAll();
    }
}
