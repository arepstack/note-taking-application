import { Module } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleGuard } from '../guards/role.guard';
import { User, UserSchema } from 'src/users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [AccessControlService, RoleGuard],
  exports: [AccessControlService, RoleGuard], // export them to use in other modules
})
export class AccessControlModule {}
