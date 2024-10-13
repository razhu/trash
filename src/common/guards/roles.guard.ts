// auth/roles.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );

    if (!requiredRole) {
      return true; // If no role is specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== requiredRole) {
      throw new ForbiddenException(
        `You need the ${requiredRole} role to access this resource`,
      );
    }

    return true;
  }
}
