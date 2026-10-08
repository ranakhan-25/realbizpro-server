import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { NotificationController } from './notifications.controller';
import { NotificationService } from './notifications.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysUser } from '@/database/models/system/sys_user.model';
import { SysNotification } from '@/database/models/system/sys_notification.model';
@Module({
  imports: [
    FirebaseModule,
    SequelizeModule.forFeature([
      SysUser,
      SysNotification,
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
