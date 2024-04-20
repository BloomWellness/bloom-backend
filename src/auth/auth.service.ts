import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestBody } from './requestbodies/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterRequestBody } from './requestbodies/register.dto';
import { VerificationRequestBody } from './requestbodies/verification.dto';
import { EmailService } from 'src/email/email.service';
import { InitiateVerificationRequestBody } from './requestbodies/initiate-verification.dto';
import { Utilities } from 'src/utils/Utilities';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private utilities: Utilities,
  ) {}

  async login(loginRequestBody: LoginRequestBody) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: loginRequestBody.email,
      },
    });
    if (user === null) {
      throw new BadRequestException(this.utilities.LOGIN_ERROR);
    }
    if (
      !this.utilities.comparePassword(loginRequestBody.password, user.password)
    ) {
      throw new BadRequestException(this.utilities.LOGIN_ERROR);
    }

    const payload = {
      email: user.email,
      name: user.name,
      access_token: this.jwtService.sign({ id: user.id }),
    };
    return payload
  }

  async requestVerification(
    initiateVerificationRequestBody: InitiateVerificationRequestBody,
  ) {
    const isUserAlreadyExist = await this.prisma.user.findFirst({
      where: { email: initiateVerificationRequestBody.email },
    });
    if (isUserAlreadyExist !== null) {
      throw new BadRequestException(this.utilities.EMAIL_TAKEN);
    }

    const otc = await this.utilities.generateOTP();

    const emailVerificationRequest =
      await this.prisma.email_verification.findFirst({
        where: { email: initiateVerificationRequestBody.email },
      });
    if (emailVerificationRequest === null) {
      await this.prisma.email_verification.create({
        data: {
          email: initiateVerificationRequestBody.email,
          otc: otc,
        },
      });
    } else {
      await this.prisma.email_verification.update({
        where: { email: initiateVerificationRequestBody.email },
        data: {
          otc: otc,
          isConsumed: false,
        },
      });
    }
    await this.emailService.dispatchOTCToEmail(
      initiateVerificationRequestBody.email,
      otc,
    );
    return this.utilities.EMAIL_SENT;
  }

  async verifyVerification(verificationRequestBody: VerificationRequestBody) {
    const emailVerification =
      await this.prisma.email_verification.findFirstOrThrow({
        where: { email: verificationRequestBody.email },
      });

    if (emailVerification.isConsumed === true) {
      throw new ForbiddenException(this.utilities.OTP_ERROR);
    }

    if (
      emailVerification !== null &&
      emailVerification.otc === verificationRequestBody.otc
    ) {
      await this.prisma.email_verification.update({
        where: { email: verificationRequestBody.email },
        data: {
          isConsumed: true,
        },
      });
      return { id: emailVerification.id };
    } else {
      throw new BadRequestException(this.utilities.OTP_ERROR);
    }
  }

  async register(registerRequestBody: RegisterRequestBody) {
    const isEmailVerified = await this.prisma.email_verification.findFirst({
      where: { id: registerRequestBody.id, isConsumed: true },
    });
    if (isEmailVerified === null) {
      throw new ForbiddenException(this.utilities.EMAIL_NOT_VERIFIED);
    }
    const isEmailTaken = await this.prisma.user.findFirst({
      where: { email: isEmailVerified.email },
    });
    if (isEmailTaken !== null) {
      throw new BadRequestException(this.utilities.EMAIL_TAKEN);
    }

    if (isEmailVerified) {
      const user = await this.prisma.user.create({
        data: {
          name: registerRequestBody.name,
          email: isEmailVerified.email,
          password: this.utilities.hashPassword(registerRequestBody.password),
        },
      });
      const payload = {
        email: user.email,
        name: user.name,
        token: this.jwtService.sign({ id: user.id }),
      };
      return payload;
    } else {
      throw new ForbiddenException(this.utilities.EMAIL_NOT_VERIFIED);
    }
  }

  async forgetPassword(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email: email },
    });
    if (user === null || user.isDeleted === true) {
      throw new BadRequestException(this.utilities.EMAIL_ERROR);
    }
    const otc = await this.utilities.generateOTP();
    const passwordResetRequest = await this.prisma.password_reset.findFirst({
      where: { email: email },
    });
    if (passwordResetRequest === null) {
      await this.prisma.password_reset.create({
        data: {
          email: email,
          otc: otc,
        },
      });
    } else {
      await this.prisma.password_reset.update({
        where: { email: email },
        data: {
          otc: otc,
          isConsumed: false,
        },
      });
    }
    await this.emailService.passwordRecoveryEmail(email, otc);
    return this.utilities.OTP_SENT;
  }

  async verifyResetPassword(email: string, otp: number) {
    const passwordReset = await this.prisma.password_reset.findFirst({
      where: { email: email },
    });
    if (passwordReset === null || passwordReset.isConsumed === true) {
      throw new BadRequestException(this.utilities.OTP_ERROR);
    }
    if (passwordReset.otc === otp) {
      await this.prisma.password_reset.update({
        where: { email: email },
        data: {
          isConsumed: true,
        },
      });
      return { id: passwordReset.id };
    } else {
      throw new BadRequestException(this.utilities.OTP_ERROR);
    }
  }

  async resetPassword(id: string, password: string) {
    const passwordReset = await this.prisma.password_reset.findFirst({
      where: { id: id },
    });
    if (passwordReset === null || passwordReset.isConsumed !== true) {
      throw new BadRequestException(this.utilities.OTP_ERROR);
    }
    await this.prisma.user.update({
      where: { email: passwordReset.email },
      data: {
        password: this.utilities.hashPassword(password),
      },
    });
    await this.prisma.password_reset.delete({
      where: { id: id },
    });
    return this.utilities.PASSWORD_RESET_SUCCESS;
  }
}
