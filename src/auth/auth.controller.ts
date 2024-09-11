import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { TwoFactorAuthDto } from './dto/two-factor-auth.dto';

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

    @Post('register')
    @ApiOperation({ summary: 'User registration' })
    @ApiResponse({ status: 201, description: 'Registration successful.' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Request password reset' })
    @ApiResponse({ status: 200, description: 'Password reset request successful.' })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @Post('change-password')
    @ApiOperation({ summary: 'Change password' })
    @ApiResponse({ status: 200, description: 'Password changed successfully.' })
    async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        return this.authService.changePassword(changePasswordDto, 'userIdPlaceholder'); // TODO: Replace with actual userId extraction logic
    }

    @Post('confirm-email')
    @ApiOperation({ summary: 'Confirm user email' })
    @ApiResponse({ status: 200, description: 'Email confirmed successfully.' })
    async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
        return this.authService.confirmEmail(confirmEmailDto);
    }

    @Post('two-factor-auth')
    @ApiOperation({ summary: 'Verify two-factor authentication' })
    @ApiResponse({ status: 200, description: 'Two-factor authentication successful.' })
    async twoFactorAuth(@Body() twoFactorAuthDto: TwoFactorAuthDto) {
        return this.authService.twoFactorAuth(twoFactorAuthDto, 'userIdPlaceholder'); // TODO: Replace with actual userId extraction logic
    }
}
