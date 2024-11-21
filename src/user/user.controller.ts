import { Controller, Get, Param, NotFoundException, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response-dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { IAuthenticatedRequest } from 'src/interfaces/auth/authenticated-request.interface';

@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
@ApiBearerAuth()
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly UserService: UserService) { }

  // TODO: Implementar metodo Create
  // @Post()
  // @ApiOperation({ summary: 'Create a new user' })
  // @ApiResponse({ status: 201, description: 'User created successfully.', type: UserResponseDto })
  // @ApiResponse({ status: 400, description: 'Invalid input.' })
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.UserService.create(createUserDto);
  // }

  @Get()
  @Roles('admin') // Verifica que este decorador esté aplicado correctamente
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users.', type: [UserResponseDto] })
  findAll() {
    return this.UserService.findAll();
  }

  @Get('user/:id?') // Prefijo 'user' añadido y parámetro opcional
  @ApiOperation({ summary: 'Get user by ID or logged-in user' })
  @ApiResponse({ status: 200, description: 'User data.', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findUser(
    @Param('id') id: string | undefined,
    @Req() req: IAuthenticatedRequest,
  ): Promise<UserResponseDto> {
    const isAdmin = req.user.roles.includes('Admin'); // Verifica si el usuario tiene rol de Admin

    // Si se proporciona un ID, solo los administradores pueden usarlo
    if (id && !isAdmin) {
      throw new UnauthorizedException('Only administrators can access this resource.');
    }

    const userId = id ? +id : req.user.userId; // Usa el ID proporcionado o el del usuario autenticado
    console.log('userId', userId);

    const user = await this.UserService.findOne(userId, isAdmin);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user as UserResponseDto;
  }


  // TODO: Implementar metodo Update
  // @Patch(':id')
  // @ApiOperation({ summary: 'Update a user by ID' })
  // @ApiResponse({ status: 200, description: 'User updated successfully.', type: UserResponseDto })
  // @ApiResponse({ status: 404, description: 'User not found.' })
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.UserService.update(+id, updateUserDto);
  // }

  // TODO: Implementar metodo Delete
  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete a user by ID' })
  // @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  // @ApiResponse({ status: 404, description: 'User not found.' })
  // remove(@Param('id') id: string) {
  //   return this.UserService.remove(+id);
  // }
}
