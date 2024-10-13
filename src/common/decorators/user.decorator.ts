import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../modules/prisma';
import { User as UserType } from '@prisma/client';

@Injectable()
export class UserDecoratorService {
  constructor(private prisma: PrismaService) {}

  async getUserByCognitoSub(cognito_sub: string): Promise<UserType> {
    return this.prisma.user.findUnique({
      where: { cognito_sub },
    });
  }
}

export const User = createParamDecorator(
  async (_data, ctx: ExecutionContext): Promise<UserType> => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const userFromJwt = request.user as UserType;
    const cognitoSub = userFromJwt?.id;

    if (!cognitoSub) {
      throw new Error('Cognito sub not found in JWT');
    }

    const userService = new UserDecoratorService(new PrismaService());
    const user = await userService.getUserByCognitoSub(cognitoSub);

    return user;
  },
);
