/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BookingDocument } from '../../../../../database/models/sales_management/sm_booking_document.model';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { QueryDocumentDto } from './dto/query-document.dto';
import { BookingReferenceService } from '../../booking-reference.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(BookingDocument)
    private readonly documentModel: typeof BookingDocument,
    private readonly bookingReference: BookingReferenceService,
  ) {}

  async create(bookingId: string, dto: CreateDocumentDto): Promise<BookingDocument> {
    try {
      const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
      return await this.documentModel.create({
        ...dto,
        bookingId: bookingUuid,
        uploadedDate: new Date(dto.uploadedDate),
      } as any);
    } catch (error) {
      throw new BadRequestException(error?.message || 'Failed to upload document.');
    }
  }

  async findAllByBooking(bookingId: string, query: QueryDocumentDto) {
    const { page = '1', limit = '50', search, category } = query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const bookingUuid = await this.bookingReference.resolveUuid(bookingId);
    const where: any = { bookingId: bookingUuid };
    
    if (category) where.category = category;
    if (search) {
      where.fileName = { [Op.iLike]: `%${search}%` };
    }

    const { rows, count } = await this.documentModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['uploaded_date', 'DESC']],
    });

    return {
      data: rows,
      meta: { total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) },
    };
  }

  async findOne(uuid: string, bookingId?: string): Promise<BookingDocument> {
    const where: any = { uuid };
    if (bookingId) where.bookingId = await this.bookingReference.resolveUuid(bookingId);
    const record = await this.documentModel.findOne({ where });
    if (!record) throw new NotFoundException(`Document ${uuid} not found`);
    return record;
  }

  async update(uuid: string, dto: UpdateDocumentDto): Promise<BookingDocument> {
    const record = await this.findOne(uuid);
    
    const data: any = { ...dto };
    if (dto.uploadedDate) data.uploadedDate = new Date(dto.uploadedDate);

    return record.update(data);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const record = await this.findOne(uuid);
    await record.destroy();
    return { message: 'Document deleted successfully' };
  }
}
