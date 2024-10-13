import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User as UserType } from '@prisma/client';

export interface CognitoJwtPayload {
  sub: string;
  email: string;
  'custom:roleType': string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // TODO: Handle refresh token
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: configService.get<string>('COGNITO_USER_POOL_CLIENT_ID'),
      issuer: configService.get<string>('COGNITO_AUTHORITY'),
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 50,
        jwksUri: `${configService.get<string>('COGNITO_AUTHORITY')}/.well-known/jwks.json`,
      }),
    });
  }

  validate(payload: CognitoJwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload['custom:roleType'],
    };
  }
}
