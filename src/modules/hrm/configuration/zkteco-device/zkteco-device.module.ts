/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { ZkTecoDeviceController } from './zkteco-device.controller';

import { ZkTecoDeviceService } from './zkteco-device.service';
import { ZkTecoDevice } from 'src/database/models/hrm/configuration/zkteco_device_model';

@Module({
  imports: [
    SequelizeModule.forFeature([ZkTecoDevice]),
  ],

  controllers: [ZkTecoDeviceController],

  providers: [ZkTecoDeviceService],

  exports: [ZkTecoDeviceService],
})
export class ZkTecoDeviceModule {}
