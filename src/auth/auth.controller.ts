import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Login successful.' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    // TODO: Implementar metodo de registro
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    async register(@Body() registerDto: CreateUserDto) {
        return this.authService.register(registerDto);
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
