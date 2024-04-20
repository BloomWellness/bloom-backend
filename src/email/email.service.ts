import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async dispatchOTCToEmail(email: string, otc: number) {
    console.log(`Email sent to ${email} with the OTP: ${otc}`);

    const subject = `Email Verification On Bloom!`;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject,
        text: `Your OTP is ${otc}`,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async passwordRecoveryEmail(email: string, otc: number) {
    console.log(`Email sent to ${email} with the OTP: ${otc}`);

    const subject = `Password Reset On Bloom!`;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject,
        text: `Your Password recovery OTP is ${otc}`,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async emailCbtRating(cbt: string, comment: string, rate: number) {
    console.log(`Email sent to ${cbt} with the description: ${comment}`);
  
    const subject = `CBT Method Rating On Bloom!`;
    try {
      await this.mailerService.sendMail({
        to: 'bloomwellnessofficial@gmail.com',
        subject,
        text: `This email is to notify you that a user has provided feedback on a CBT method.\n\nThe CBT method in question is "${cbt}".\n\nThe user rated this method ${rate} stars and provided the following comment:\n\n${comment}`,
      });
    } catch (error) {
      console.error(error);
    }
  }
  
}
