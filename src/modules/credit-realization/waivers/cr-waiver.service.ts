import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CrWaiverRequest } from '../../../database/models/credit-realization/cr_waiver_request.model';
import { CrSaleAgreement } from '../../../database/models/credit-realization/cr_sale_agreement.model';
import { CrInstallmentPlan } from '../../../database/models/credit-realization/cr_installment_plan.model';
import { CreateCrWaiverDto, UpdateCrWaiverStatusDto } from './dto/create-cr-waiver.dto';

@Injectable()
export class CrWaiverService {
  constructor(
    @InjectModel(CrWaiverRequest)
    private readonly waiverModel: typeof CrWaiverRequest,
    @InjectModel(CrSaleAgreement)
    private readonly agreementModel: typeof CrSaleAgreement,
    @InjectModel(CrInstallmentPlan)
    private readonly planModel: typeof CrInstallmentPlan,
  ) {}

  async create(createDto: CreateCrWaiverDto, orgId?: string, userEmail?: string) {
    const agreement = await this.agreementModel.findByPk(createDto.sale_agreement_id);
    if (!agreement) {
      throw new NotFoundException(`Sale Agreement with ID ${createDto.sale_agreement_id} not found`);
    }

    const plan = await this.planModel.findByPk(createDto.installment_plan_id);
    if (!plan) {
      throw new NotFoundException(`Installment Plan with ID ${createDto.installment_plan_id} not found`);
    }

    if (Number(plan.sale_agreement_id) !== Number(createDto.sale_agreement_id)) {
      throw new BadRequestException('Installment Plan does not belong to the specified Sale Agreement');
    }

    const payload: any = {
      ...createDto,
      org_id: orgId || createDto.org_id || agreement.org_id || 'default-org-id',
      approval_status: 'pending',
      approved_amount: 0,
      createdBy: userEmail || createDto.createdBy,
    };

    return this.waiverModel.create(payload);
  }

  async findAll(query: {
    org_id?: string;
    sale_agreement_id?: number;
    approval_status?: string;
  }) {
    const where: any = {};
    if (query.org_id) where.org_id = query.org_id;
    if (query.sale_agreement_id) where.sale_agreement_id = query.sale_agreement_id;
    if (query.approval_status) where.approval_status = query.approval_status;

    return this.waiverModel.findAll({
      where,
      include: [
        {
          model: this.agreementModel,
          as: 'sale_agreement',
          attributes: [
            'id',
            'uuid',
            'agreement_number',
            'customer_name',
            'customer_id',
            'property_type',
            'unit_identifier',
          ],
        },
        {
          model: this.planModel,
          as: 'installment_plan',
          attributes: [
            'id',
            'uuid',
            'installment_no',
            'title',
            'due_date',
            'payable_amount',
            'due_amount',
            'penalty_amount',
            'penalty_waived',
            'status',
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(uuid: string, orgId?: string) {
    const where: any = { uuid };
    if (orgId) where.org_id = orgId;

    const waiver = await this.waiverModel.findOne({
      where,
      include: [
        {
          model: this.agreementModel,
          as: 'sale_agreement',
        },
        {
          model: this.planModel,
          as: 'installment_plan',
        },
      ],
    });

    if (!waiver) {
      throw new NotFoundException(`Waiver Request with UUID ${uuid} not found`);
    }

    return waiver;
  }

  async updateStatus(
    uuid: string,
    dto: UpdateCrWaiverStatusDto,
    orgId?: string,
    userEmail?: string,
  ) {
    const waiver = await this.findOne(uuid, orgId);
    if (waiver.approval_status !== 'pending') {
      throw new BadRequestException(`Waiver request is already ${waiver.approval_status}`);
    }

    const plan = await this.planModel.findByPk(waiver.installment_plan_id);
    if (!plan) {
      throw new NotFoundException(`Installment Plan with ID ${waiver.installment_plan_id} not found`);
    }

    const approvedAmount =
      dto.approval_status === 'approved'
        ? dto.approved_amount !== undefined
          ? Number(dto.approved_amount)
          : Number(waiver.requested_amount)
        : 0;

    if (dto.approval_status === 'approved' && approvedAmount > 0) {
      const currentWaived = Number(plan.penalty_waived || 0);
      const newWaived = currentWaived + approvedAmount;
      const currentDue = Number(plan.due_amount || 0);
      const newDue = Math.max(0, currentDue - approvedAmount);

      let newStatus = plan.status;
      if (newDue <= 0 && Number(plan.paid_amount || 0) >= Number(plan.payable_amount || 0)) {
        newStatus = 'paid';
      }

      await plan.update({
        penalty_waived: newWaived,
        due_amount: newDue,
        status: newStatus,
        updatedBy: userEmail,
      });
    }

    return waiver.update({
      approval_status: dto.approval_status,
      approved_amount: approvedAmount,
      approval_remarks: dto.approval_remarks,
      approver_id: dto.approver_id,
      approver_name: dto.approver_name || userEmail,
      actioned_at: new Date(),
      updatedBy: userEmail,
    });
  }

  async remove(uuid: string, orgId?: string, userEmail?: string) {
    const waiver = await this.findOne(uuid, orgId);
    if (waiver.approval_status === 'approved') {
      throw new BadRequestException('Cannot delete an already approved waiver request');
    }
    if (userEmail) {
      waiver.deletedBy = userEmail;
      await waiver.save();
    }
    await waiver.destroy();
    return { success: true, message: `Waiver Request ${uuid} deleted successfully` };
  }
}
