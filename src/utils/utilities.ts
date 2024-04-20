import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Utilities {
    
    PASSWORD_RESET_SUCCESS = 'Password reset successful';
    LOGIN_ERROR = 'Invalid email or password';
    LOGIN_SUCCESS = 'Login successful';
    EMAIL_ERROR = 'Email not found';
    EMAIL_TAKEN = 'Email already taken';
    EMAIL_SENT = 'Email sent';
    EMAIL_VERIFIED = 'Email verified';
    EMAIL_ALREADY_VERIFIED = 'Email already verified';
    EMAIL_NOT_VERIFIED = 'Email not verified';
    OTP_SENT = 'OTP sent to email';
    OTP_ERROR = 'Invalid OTP or Email';

  hashPassword(password: string): string {
    const saltOrRounds = 10;
    return bcrypt.hashSync(password, saltOrRounds);
  }

  comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  async generateOTP() {
    return Math.floor(10000 + Math.random() * 90000);
 }
}
