/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { QueryEmployeeCardDto } from './dto/query-employee-card.dto';

@Injectable()
export class EmployeeCardService {
  constructor(
    @InjectModel(EmployeeList)
    private readonly employeeListModel: typeof EmployeeList,
  ) {}

  async findAll(query: QueryEmployeeCardDto, currentUser?: any) {
    const {
      departmentId,
      designationId,
      page = 1,
      limit = 12,
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {};
    const effectiveOrgId = (query as any)?.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) {
      where.orgId = effectiveOrgId;
    }
    const effectiveProjectId = (query as any)?.projectId ?? currentUser?.projectId;
    if (effectiveProjectId) {
      where.projectId = effectiveProjectId;
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (designationId) {
      where.designationId = designationId;
    }

    // designation name EmployeeList-er registered association theke nei
    const assoc: any = (this.employeeListModel as any).associations?.designation;
    const target: any = assoc?.target;
    const canInclude = !!(target && target.sequelize);

    const { rows, count } = await this.employeeListModel.findAndCountAll({
      where,
      attributes: [
        'uuid',
        'name',
        'employeeCode',
        'nid',
        'email',
        'phone',
        'image',
        'status',
        'departmentId',
        'designationId',
      ],
      ...(canInclude
        ? { include: [{ model: target, as: 'designation', required: false }] }
        : {}),
      order: [['createdAt', 'ASC']],
      limit,
      offset: skip,
      distinct: true,
    } as any);

    const data = rows.map((row) => {
      const designation: any = (row as any).designation;
      return {
        uuid: row.uuid,
        name: row.name,
        designation:
          designation?.name ??
          designation?.title ??
          designation?.designationName ??
          null,
        employeeCode: row.employeeCode,
        nid: row.nid,
        email: row.email,
        phone: row.phone,
        image: row.image ?? null,
        status: row.status,
        departmentId: row.departmentId,
        designationId: row.designationId,
      };
    });

    const totalPages = Math.ceil(count / limit);

    return {
      data,
      meta: {
        page,
        pageNo: page,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
        limit,
        skip,
        total: count,
        totalPages,
      },
    };
  }
}
