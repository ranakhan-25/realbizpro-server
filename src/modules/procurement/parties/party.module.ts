import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Party } from 'src/database/models/procurement/parties/party.model';
import { PartyDocument } from 'src/database/models/procurement/parties/party-document.model';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';

@Module({ imports: [SequelizeModule.forFeature([Party, PartyDocument])], controllers: [PartyController], providers: [PartyService], exports: [PartyService] })
export class PartyModule {}
