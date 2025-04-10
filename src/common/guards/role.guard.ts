import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { AccessControlService } from '../shared/access-control.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../users/user.schema';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControlService: AccessControlService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;

    if (!userId) return false;

    const user = await this.userModel.findById(userId).lean();

    if (!user || !user.role) return false;

    // Check if user's role matches one of the required ones
    const userRole = user.role.toUpperCase();
    return requiredRoles.includes(userRole as Role);
  }
}
