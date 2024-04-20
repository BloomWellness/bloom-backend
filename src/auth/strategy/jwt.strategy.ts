import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpire: false,
      secretOrKey: configService.get<string>('SECRET_KEY'),
    });
  }
  async validate(payload: any) {
    if (!this.validate) {
      throw new UnauthorizedException();
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    return user;
  }
}
