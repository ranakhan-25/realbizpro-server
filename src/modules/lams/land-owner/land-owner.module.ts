import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LandOwner } from '../../../database/models/lams/land-owner.model';
import { LandOwnerController } from './land-owner.controller';
import { LandOwnerService } from './land-owner.service';

@Module({
  imports: [SequelizeModule.forFeature([LandOwner])],
  controllers: [LandOwnerController],
  providers: [LandOwnerService],
})
export class LandOwnerModule {}
