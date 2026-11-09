/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { QueryEmployeeHierarchyDto } from './dto/query-employee-hierarchy.dto';

@Injectable()
export class EmployeeHierarchyService {
  constructor(
    @InjectModel(EmployeeList)
    private readonly employeeListModel: typeof EmployeeList,
  ) {}

  async findAll(
    query: QueryEmployeeHierarchyDto,
  ) {
    const {
      search,
      status,
      departmentId,
      designationId,
      unitId,
      sectionId,
    } = query;

    const where: any = {};
    if (query.orgId) {
      where.orgId = query.orgId;
    }
    if ((query as any).projectId) {
      where.projectId = (query as any).projectId;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        {
          employeeCode: {
            [Op.like]: `%${search}%`,
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (designationId) {
      where.designationId = designationId;
    }

    if (unitId) {
      where.unitId = unitId;
    }

    if (sectionId) {
      where.sectionId = sectionId;
    }

    // Designation class import na kore, EmployeeList-er registered association theke nei
    // (jate alada class instance er karone "needs to be added to a Sequelize instance" error na ashe)
    const assoc: any = (
      this.employeeListModel as any
    ).associations?.designation;
    const target: any = assoc?.target;
    const canInclude = !!(
      target && target.sequelize
    );

    const rows =
      await this.employeeListModel.findAll({
        where,
        attributes: [
          'uuid',
          'name',
          'employeeCode',
          'email',
          'phone',
          'image',
          'status',
          'joiningDate',
          'departmentId',
          'designationId',
          'unitId',
          'sectionId',
        ],
        ...(canInclude
          ? {
              include: [
                {
                  model: target,
                  as: 'designation',
                  required: false,
                },
              ],
              order: [
                [
                  {
                    model: target,
                    as: 'designation',
                  },
                  'createdAt',
                  'ASC',
                ],
                ['createdAt', 'ASC'],
              ],
            }
          : { order: [['createdAt', 'ASC']] }),
      } as any);

    const data = rows.map((row) => {
      const designation: any = (row as any)
        .designation;
      const statusText = row.status
        ? row.status.charAt(0).toUpperCase() +
          row.status.slice(1)
        : '';

      return {
        // org chart node format
        id: row.uuid,
        pid: null, // employee-to-employee parent link model-e nei
        name: row.name,
        label: `${row.name} (${statusText})`,
        title:
          designation?.name ??
          designation?.title ??
          designation?.designationName ??
          null,
        img: row.image ?? null,

        // extra details
        status: row.status,
        employeeCode: row.employeeCode,
        email: row.email,
        phone: row.phone,
        joiningDate: row.joiningDate,
        departmentId: row.departmentId,
        designationId: row.designationId,
        unitId: row.unitId ?? null,
        sectionId: row.sectionId ?? null,
      };
    });

    return {
      data,
      meta: {
        total: data.length,
      },
    };
  }
}
