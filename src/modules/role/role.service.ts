import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { UserRole } from '../../enums';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoleByName(role: UserRole) {
    return this.prisma.role.findUnique({ where: { role_name: role } });
  }

  async assignUserRole(userId: string, userRole: UserRole) {
    const role = await this.getRoleByName(userRole);

    await this.prisma.userRole.create({
      data: {
        user_id: userId,
        role_id: role.id,
      },
    });
  }
}
