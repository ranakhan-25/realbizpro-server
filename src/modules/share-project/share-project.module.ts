import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShareUserModule } from '../share-user/share-user.module';
import { ShareUser } from '../../database/models/share-user/share-user.model';
import { ShareUserAuthGuard } from '../share-user/share-user-auth.guard';
import { ShareUserRoleGuard } from '../share-user/share-user-role.guard';
import { ShareProject } from '../../database/models/share-project/share-project.model';
import { ShareProjectCategory } from '../../database/models/share-project/share-project-category.model';
import { ShareProjectImage } from '../../database/models/share-project/share-project-image.model';
import { ShareProjectDocument } from '../../database/models/share-project/share-project-document.model';
import { ShareProjectSubmission } from '../../database/models/share-project/share-project-submission.model';
import { ShareProjectReview } from '../../database/models/share-project/share-project-review.model';
import { ShareProjectStatusHistory } from '../../database/models/share-project/share-project-status-history.model';
import { ShareProjectInvestment } from '../../database/models/share-project/share-project-investment.model';
import { SysUser } from '../../database/models/system/sys_user.model';
import { ShareProjectController } from './share-project.controller';
import { ShareProjectService } from './share-project.service';

@Module({
  imports: [
    ShareUserModule,
    ConfigModule,
    JwtModule.register({}),
    SequelizeModule.forFeature([
      ShareUser,
      ShareProject,
      ShareProjectCategory,
      ShareProjectImage,
      ShareProjectDocument,
      ShareProjectSubmission,
      ShareProjectReview,
      ShareProjectStatusHistory,
      ShareProjectInvestment,
      SysUser,
    ]),
  ],
  controllers: [ShareProjectController],
  providers: [ShareProjectService, ShareUserAuthGuard, ShareUserRoleGuard],
  exports: [ShareProjectService],
})
export class ShareProjectModule {}
