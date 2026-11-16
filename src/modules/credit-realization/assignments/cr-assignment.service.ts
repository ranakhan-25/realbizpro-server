import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CrOfficerAssignment } from '../../../database/models/credit-realization/cr_officer_assignment.model';
import { CrSaleAgreement } from '../../../database/models/credit-realization/cr_sale_agreement.model';
import { CrInstallmentPlan } from '../../../database/models/credit-realization/cr_installment_plan.model';
import { CrInstallmentPayment } from '../../../database/models/credit-realization/cr_installment_payment.model';
import {
  CreateCrAssignmentDto,
  UpdateCrAssignmentDto,
} from './dto/create-cr-assignment.dto';

@Injectable()
export class CrAssignmentService {
  constructor(
    @InjectModel(CrOfficerAssignment)
    private readonly assignmentModel: typeof CrOfficerAssignment,
    @InjectModel(CrSaleAgreement)
    private readonly agreementModel: typeof CrSaleAgreement,
    @InjectModel(CrInstallmentPlan)
    private readonly planModel: typeof CrInstallmentPlan,
    @InjectModel(CrInstallmentPayment)
    private readonly paymentModel: typeof CrInstallmentPayment,
  ) {}

  async create(createDto: CreateCrAssignmentDto, orgId?: string, userEmail?: string) {
    const agreement = await this.agreementModel.findByPk(createDto.sale_agreement_id);
    if (!agreement) {
      throw new NotFoundException(`Sale Agreement with ID ${createDto.sale_agreement_id} not found`);
    }

    const payload: any = {
      ...createDto,
      org_id: orgId || createDto.org_id || agreement.org_id || 'default-org-id',
      createdBy: userEmail || createDto.createdBy,
    };

    return this.assignmentModel.create(payload);
  }

  async findAll(query: {
    org_id?: string;
    officer_id?: string;
    status?: string;
    sale_agreement_id?: number;
  }) {
    const where: any = {};
    if (query.org_id) where.org_id = query.org_id;
    if (query.officer_id) where.officer_id = query.officer_id;
    if (query.status) where.status = query.status;
    if (query.sale_agreement_id) where.sale_agreement_id = query.sale_agreement_id;

    return this.assignmentModel.findAll({
      where,
      include: [
        {
          model: this.agreementModel,
          as: 'sale_agreement',
          attributes: [
            'id',
            'uuid',
            'agreement_number',
            'customer_id',
            'customer_name',
            'customer_phone',
            'property_type',
            'unit_identifier',
            'total_price',
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

    const assignment = await this.assignmentModel.findOne({
      where,
      include: [
        {
          model: this.agreementModel,
          as: 'sale_agreement',
        },
      ],
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with UUID ${uuid} not found`);
    }

    return assignment;
  }

  async update(uuid: string, updateDto: UpdateCrAssignmentDto, orgId?: string, userEmail?: string) {
    const assignment = await this.findOne(uuid, orgId);

    const payload: any = {
      ...updateDto,
      updatedBy: userEmail,
    };

    return assignment.update(payload);
  }

  async remove(uuid: string, orgId?: string, userEmail?: string) {
    const assignment = await this.findOne(uuid, orgId);
    if (userEmail) {
      assignment.deletedBy = userEmail;
      await assignment.save();
    }
    await assignment.destroy();
    return { success: true, message: `Assignment ${uuid} deleted successfully` };
  }

  async bulkAssign(
    body: {
      officer_id: string;
      officer_name: string;
      sale_agreement_ids: number[];
      due_date: string;
      notes?: string;
    },
    orgId?: string,
    userEmail?: string,
  ) {
    const results = [];
    for (const agreementId of body.sale_agreement_ids) {
      const agreement = await this.agreementModel.findByPk(agreementId);
      if (agreement) {
        const item = await this.assignmentModel.create({
          org_id: orgId || agreement.org_id || 'default-org-id',
          officer_id: body.officer_id,
          officer_name: body.officer_name,
          sale_agreement_id: agreementId,
          target_amount: 0,
          collected_amount: 0,
          due_date: body.due_date,
          status: 'assigned',
          notes: body.notes,
          createdBy: userEmail,
        });
        results.push(item);
      }
    }
    return { count: results.length, assignments: results };
  }

  async syncProgress(uuid: string, orgId?: string) {
    const assignment = await this.findOne(uuid, orgId);

    const plans = await this.planModel.findAll({
      where: { sale_agreement_id: assignment.sale_agreement_id },
      attributes: ['id'],
    });
    const planIds = plans.map((p) => p.id);
    if (planIds.length === 0) {
      return assignment;
    }

    // Sum payments made for these installment plans on or after assignment_date
    const payments = await this.paymentModel.findAll({
      where: {
        installment_plan_id: {
          [Op.in]: planIds,
        },
        payment_date: {
          [Op.gte]: assignment.assignment_date,
        },
      },
    });

    const totalCollected = payments.reduce((acc, p) => acc + Number(p.paid_amount || 0), 0);
    const target = Number(assignment.target_amount || 0);

    let status = assignment.status;
    if (target > 0 && totalCollected >= target) {
      status = 'completed';
    } else if (totalCollected > 0) {
      status = 'in_progress';
    }

    return assignment.update({
      collected_amount: totalCollected,
      status,
    });
  }
}
