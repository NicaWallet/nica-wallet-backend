import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/register.dto';
import { Request } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 200, description: 'Login successful.' })
    async login(@Body() loginDto: LoginDto, @Req() req: Request) {
        const result = await this.authService.login(loginDto, req);
        // console.log('Login executed successfully');
        return result;
    }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'Validation failed' })
    async register(@Body() registerDto: CreateUserDto) {
        const result = await this.authService.register(registerDto);
        // console.log('Registration executed successfully');
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

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Request a password reset link' })
    @ApiBody({ type: ForgotPasswordDto, description: 'Email of the user requesting a password reset' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Password reset link sent successfully',
        schema: {
            example: { message: 'Password reset link sent successfully to user@example.com' },
        }
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Email not found',
        schema: {
            example: {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Email not found',
                error: 'Bad Request'
            }
        }
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: 'Internal server error',
        schema: {
            example: {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while sending the reset link',
                error: 'Internal Server Error'
            }
        }
    })
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        try {
            await this.authService.sendResetPasswordLink(forgotPasswordDto.email);
            return { message: `Password reset link sent successfully to ${forgotPasswordDto.email}` };
        } catch (error) {
            if (error.status === HttpStatus.BAD_REQUEST) {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Email not found',
                    error: 'Bad Request',
                };
            }
            // Catch-all for any other errors
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'An error occurred while sending the reset link',
                error: 'Internal Server Error',
            };
        }
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Reset user password' })
    @ApiResponse({ status: 200, description: 'Password reset successfully.' })
    @ApiResponse({ status: 401, description: 'Invalid or expired token.' })
    async resetPassword(@Body('token') token: string, @Body() resetPasswordDto: ResetPasswordDto) {
        await this.authService.resetPassword(token, resetPasswordDto.newPassword);
        return { message: 'Password reset successfully' };
    }

}
