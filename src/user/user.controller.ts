import { Controller, Get, Param, NotFoundException, UseGuards, Req, UnauthorizedException, Body, Patch, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response-dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { IAuthenticatedRequest } from 'src/interfaces/auth/authenticated-request.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { parse, isValid } from 'date-fns';

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


  @Patch('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: IAuthenticatedRequest,
  ) {
    const userId = req.user.userId;

    return this.UserService.changePassword(
      userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @Patch('update-profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUserProfile(
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @Req() req: IAuthenticatedRequest,
  ): Promise<UserResponseDto> {
    const userId = req.user.userId;

    let processedBirthdate = updateUserProfileDto.birthdate;

    if (processedBirthdate) {
      try {
        // Intentamos convertir la fecha usando el constructor de Date
        const dateObject = new Date(processedBirthdate);

        // Validar que sea una fecha válida
        if (isNaN(dateObject.getTime())) {
          throw new Error(); // Forzar el error si la fecha es inválida
        }

        // Convertir a formato ISO 8601
        processedBirthdate = dateObject.toISOString();
      } catch (error) {
        throw new BadRequestException('Invalid birthdate format. Use ISO 8601, YYYY-MM-DD, or a valid Date string.');
      }
    }

    const updateData = {
      ...updateUserProfileDto,
      birthdate: processedBirthdate,
    };

    const updatedUser = await this.UserService.updateUserProfile(userId, updateData);

    return {
      ...updatedUser,
      birthdate: updatedUser.birthdate instanceof Date
        ? updatedUser.birthdate.toISOString()
        : updatedUser.birthdate,
    };
  }

  // TODO: Implementar metodo Delete
  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete a user by ID' })
  // @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  // @ApiResponse({ status: 404, description: 'User not found.' })
  // remove(@Param('id') id: string) {
  //   return this.UserService.remove(+id);
  // }
}
