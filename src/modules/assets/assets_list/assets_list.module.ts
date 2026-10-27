/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Asset } from 'src/database/models/accounts/assets/assets_list_model';
import { AssetController } from './assets_list.controller';
import { AssetService } from './assets_list.service';


@Module({
  imports: [
    SequelizeModule.forFeature([Asset]),
  ],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetsListModule {}