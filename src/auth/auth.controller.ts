import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/register.dto';
import { Request } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Login successful.' })
    async login(@Body() loginDto: LoginDto, @Req() req: Request) {
        const result = await this.authService.login(loginDto, req);
        console.log('Login executed successfully');
        return result;
    }

    // TODO: Implementar metodo de registro
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    async register(@Body() registerDto: CreateUserDto) {
        const result = await this.authService.register(registerDto);
        console.log('Registration executed successfully');
        return result;
    }

    @Post('refresh-token')
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Token refreshed successfully.' })
    @ApiResponse({ status: 401, description: 'Invalid or expired token.' })
    @ApiBody({ schema: { example: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjA5MjI2MjIyLCJleHAiOjE2MDkyMjYyMjJ9.1J7' } } })
    async refreshToken(@Body('token') token: string) {
        const newToken = await this.authService.refreshToken(token);
        return { message: 'Token refreshed successfully', access_token: newToken };
    }

    // TODO: Implementar metodos de recuperacion de contraseña
    // @Post('reset-password')
    // @ApiOperation({ summary: 'Request password reset' })
    // @ApiResponse({ status: 200, description: 'Password reset request successful.' })
    // async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    //     return this.authService.resetPassword(resetPasswordDto);
    // }

    // TODO: Implementar metodos de cambio de contraseña
    // @Post('change-password')
    // @ApiOperation({ summary: 'Change password' })
    // @ApiResponse({ status: 200, description: 'Password changed successfully.' })
    // async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    //     return this.authService.changePassword(changePasswordDto, 'userIdPlaceholder'); // TODO: Replace with actual userId extraction logic
    // }

    // TODO: Implementar metodos de confirmacion de email
    // @Post('confirm-email')
    // @ApiOperation({ summary: 'Confirm user email' })
    // @ApiResponse({ status: 200, description: 'Email confirmed successfully.' })
    // async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
    //     return this.authService.confirmEmail(confirmEmailDto);
    // }

    // TODO: Implementar metodos de autenticacion de dos factores
    // @Post('two-factor-auth')
    // @ApiOperation({ summary: 'Verify two-factor authentication' })
    // @ApiResponse({ status: 200, description: 'Two-factor authentication successful.' })
    // async twoFactorAuth(@Body() twoFactorAuthDto: TwoFactorAuthDto) {
    //     return this.authService.twoFactorAuth(twoFactorAuthDto, 'userIdPlaceholder'); // TODO: Replace with actual userId extraction logic
    // }
}
