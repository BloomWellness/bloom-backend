import { Body, Controller, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import { LoginRequestBody } from './requestbodies/login.dto';
import { AuthService } from './auth.service';
import { RegisterRequestBody } from './requestbodies/register.dto';
import { VerificationRequestBody } from './requestbodies/verification.dto';
import { InitiateVerificationRequestBody } from './requestbodies/initiate-verification.dto';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ForgetPasswordRequestBody } from './requestbodies/forget-password.dto';
import { ResetPasswordRequestBody } from './requestbodies/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBadRequestResponse({ description: 'Invalid email or password' })
  @ApiOkResponse({ description: 'Login successful' })
  async login(@Body() loginRequestBody: LoginRequestBody) {
    return await this.authService.login(loginRequestBody);
  }

  @Post('request-verification')
  @ApiBadRequestResponse({ description: 'Email already taken' })
  @ApiOkResponse({ description: 'Verification email sent successfully' })
  async requestVerification(
    @Body() initiateVerificationRequestBody: InitiateVerificationRequestBody,
  ) {
    return await this.authService.requestVerification(
      initiateVerificationRequestBody,
    );
  }

  @Put('verify')
  async verify(@Body() verificationRequestBody: VerificationRequestBody) {
    return await this.authService.verifyVerification(verificationRequestBody);
  }

  @Post('register')
  @ApiOkResponse({ description: 'User registered successfully' })
  @ApiBadRequestResponse({ description: 'Email already taken' })
  @ApiForbiddenResponse({ description: 'Email not verified' })
  async register(@Body() registerRequestBody: RegisterRequestBody) {
    return await this.authService.register(registerRequestBody);
  }

  @Post('forget-password')
    @ApiOkResponse({ description: 'OTP sent to email' })
    @ApiBadRequestResponse({ description: 'Email not found' })
    async forgetPassword(@Body() body: ForgetPasswordRequestBody) {
        return await this.authService.forgetPassword(body.email);
    }

    @Put('verify-reset-password')
    @ApiBadRequestResponse({ description: 'Invalid OTP or Email' })
    @ApiOkResponse({ description: 'OTP verified successfully' })
    async verifyResetPassword(@Body() body: VerificationRequestBody) {
        return await this.authService.verifyResetPassword(body.email, body.otc);
    }

    @Put('reset-password')
    @ApiBadRequestResponse({ description: 'Invalid OTP or Email' })
    @ApiOkResponse({ description: 'Password reset successfully' })
    async resetPassword(@Body() body: ResetPasswordRequestBody) {
        return await this.authService.resetPassword(body.id, body.password);
    }
}
