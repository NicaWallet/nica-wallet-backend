import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly UserService: UserService) {}

  // TODO: Implementar metodo Create
  // @Post()
  // @ApiOperation({ summary: 'Create a new user' })
  // @ApiResponse({ status: 201, description: 'User created successfully.', type: UserResponseDto })
  // @ApiResponse({ status: 400, description: 'Invalid input.' })
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.UserService.create(createUserDto);
  // }

  // TODO: Implementar metodo FindAll
  // @Get()
  // @ApiOperation({ summary: 'Get all users' })
  // @ApiResponse({ status: 200, description: 'List of all users.', type: [UserResponseDto] })
  // findAll() {
  //   return this.UserService.findAll();
  // }

  // TODO: Implementar metodo FindOne
  // @Get(':id')
  // @ApiOperation({ summary: 'Get a user by ID' })
  // @ApiResponse({ status: 200, description: 'User data.', type: UserResponseDto })
  // @ApiResponse({ status: 404, description: 'User not found.' })
  // findOne(@Param('id') id: string) {
  //   return this.UserService.findOne(+id);
  // }

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
