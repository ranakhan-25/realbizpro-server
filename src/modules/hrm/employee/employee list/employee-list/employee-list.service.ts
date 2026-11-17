import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import {
  EmployeeList,
  EmployeeListStatus,
} from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { Unit } from 'src/database/models/hrm/employee/hrm_unit_model';
import { Section } from 'src/database/models/hrm/employee/hrm_section_model';
import { Department } from 'src/database/models/hrm/employee/hrm_department_model';
import { Designation } from 'src/database/models/hrm/employee/hrm_designation_model';
import { SalaryGrade } from 'src/database/models/hrm/employee/hrm_salary_grade_model';
// import { HrmShift } from 'src/database/models/hrm/employee/hrm_hrm_shift_model';

import { Under } from 'src/database/models/hrm/employee/hrm_under_model';
import { CreateEmployeeListDto } from './dto/create-employee-list.dto';
import { UpdateEmployeeListDto } from './dto/update-employee-list.dto';
import { QueryEmployeeListDto } from './dto/query-employee-list.dto';
import { EmployeeType } from 'src/database/models/hrm/employee/hrm_employee_type-model';
import { Shift } from 'src/database/models/hrm/employee/hrm_shift_model';

@Injectable()
export class EmployeeListService {
  // withRelations=true dile ei relation gulo response-e ashbe
  private readonly relationIncludes = [
    { association: 'unit', required: false },
    { association: 'section', required: false },
    {
      association: 'department',
      required: false,
    },
    {
      association: 'designation',
      required: false,
    },
    {
      association: 'salaryGrade',
      required: false,
    },
    { association: 'shift', required: false },
    {
      association: 'employeeType',
      required: false,
    },
    { association: 'under', required: false },
  ];

  constructor(
    @InjectModel(EmployeeList)
    private readonly employeeListModel: typeof EmployeeList,
    @InjectModel(Unit)
    private readonly unitModel: typeof Unit,
    @InjectModel(Section)
    private readonly sectionModel: typeof Section,
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
    @InjectModel(Designation)
    private readonly designationModel: typeof Designation,
    @InjectModel(SalaryGrade)
    private readonly salaryGradeModel: typeof SalaryGrade,
    @InjectModel(Shift)
    private readonly shiftModel: typeof Shift,
    @InjectModel(EmployeeType)
    private readonly employeeTypeModel: typeof EmployeeType,
    @InjectModel(Under)
    private readonly underModel: typeof Under,
  ) {}

  // ---------- helpers ----------

  // jei relation id pathano hoyeche (ar ager theke alada), ota database-e ache kina check kore
  private async ensureRelationsExist(
    data: Record<string, any>,
    current?: Record<string, any>,
  ): Promise<void> {
    const checks: [string, any, string][] = [
      ['unitId', this.unitModel, 'Unit'],
      ['sectionId', this.sectionModel, 'Section'],
      [
        'departmentId',
        this.departmentModel,
        'Department',
      ],
      [
        'designationId',
        this.designationModel,
        'Designation',
      ],
      [
        'salaryGradeId',
        this.salaryGradeModel,
        'Salary grade',
      ],
      ['shiftId', this.shiftModel, 'Shift'],
      [
        'employeeTypeId',
        this.employeeTypeModel,
        'Employee type',
      ],
      ['underId', this.underModel, 'Under'],
    ];

    for (const [key, model, label] of checks) {
      const value = data[key];

      if (value && value !== current?.[key]) {
        const found = await model.findOne({
          where: { uuid: value },
        });

        if (!found) {
          throw new NotFoundException(
            `${label} #${value} not found`,
          );
        }
      }
    }
  }

  // employeeCode unique, tai soft-deleted gulo-o check kori
  private async ensureCodeAvailable(
    employeeCode: string,
    excludeUuid?: string,
  ): Promise<void> {
    const where: any = { employeeCode };

    if (excludeUuid) {
      where.uuid = { [Op.ne]: excludeUuid };
    }

    const existing =
      await this.employeeListModel.findOne({
        where,
        paranoid: false,
      });

    if (existing) {
      throw new BadRequestException(
        existing.deletedAt
          ? `Employee code "${employeeCode}" already exists in deleted employees, please restore it`
          : `Employee code "${employeeCode}" already exists`,
      );
    }
  }

  private validateDates(
    joiningDate: string,
    leaveDate?: string | null,
  ): void {
    if (
      leaveDate &&
      new Date(leaveDate).getTime() <
        new Date(joiningDate).getTime()
    ) {
      throw new BadRequestException(
        'Leave date cannot be before joining date',
      );
    }
  }

  // ---------- CRUD ----------

  async create(
    dto: CreateEmployeeListDto,
    userId?: number,
    currentUser?: any,
  ): Promise<EmployeeList> {
    await this.ensureCodeAvailable(
      dto.employeeCode,
    );
    this.validateDates(
      dto.joiningDate,
      dto.leaveDate,
    );
    await this.ensureRelationsExist(dto);

    const record =
      await this.employeeListModel.create({
        ...dto,
        createdBy: userId ? String(userId) : (dto as any).createdBy ?? (dto as any).addedById ?? null,
        orgId: (dto as any).orgId ?? currentUser?.orgId ?? null,
        projectId: (dto as any).projectId ?? currentUser?.projectId ?? null,
        status:
          dto.status ?? EmployeeListStatus.ACTIVE,
      } as any);

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryEmployeeListDto, currentUser?: any) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      departmentId,
      designationId,
      unitId,
      sectionId,
      salaryGradeId,
      shiftId,
      employeeTypeId,
      underId,
      status,
      maritalStatus,
      joiningDateFrom,
      joiningDateTo,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withRelations = false,
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null
        ? skip
        : (page - 1) * limit;

    const where: any = {};
    const effectiveOrgId = (query as any)?.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) {
      where.orgId = effectiveOrgId;
    }
    const effectiveProjectId = (query as any)?.projectId ?? currentUser?.projectId;
    if (effectiveProjectId) {
      where.projectId = effectiveProjectId;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        {
          employeeCode: {
            [Op.like]: `%${search}%`,
          },
        },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { nid: { [Op.like]: `%${search}%` } },
      ];
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

    if (salaryGradeId) {
      where.salaryGradeId = salaryGradeId;
    }

    if (shiftId) {
      where.shiftId = shiftId;
    }

    if (employeeTypeId) {
      where.employeeTypeId = employeeTypeId;
    }

    if (underId) {
      where.underId = underId;
    }

    if (status) {
      where.status = status;
    }

    if (maritalStatus) {
      where.maritalStatus = maritalStatus;
    }

    if (joiningDateFrom && joiningDateTo) {
      where.joiningDate = {
        [Op.between]: [
          joiningDateFrom,
          joiningDateTo,
        ],
      };
    } else if (joiningDateFrom) {
      where.joiningDate = {
        [Op.gte]: joiningDateFrom,
      };
    } else if (joiningDateTo) {
      where.joiningDate = {
        [Op.lte]: joiningDateTo,
      };
    }

    const { rows, count } =
      await this.employeeListModel.findAndCountAll(
        {
          where,
          include: withRelations
            ? (this.relationIncludes as any)
            : undefined,
          limit,
          offset,
          order: [[sortBy, sortOrder]],
          paranoid: !withDeleted,
        },
      );

    const totalPages =
      Math.ceil(count / limit) || 1;
    const currentPage =
      skip !== undefined && skip !== null
        ? Math.floor(skip / limit) + 1
        : page;

    const nextPage =
      currentPage < totalPages
        ? currentPage + 1
        : null;

    const previousPage =
      currentPage > 1 ? currentPage - 1 : null;

    return {
      data: rows,
      meta: {
        page: currentPage,
        pageNo: currentPage,
        nextPage,
        previousPage,
        limit,
        skip: offset,
        total: count,
        totalPages,
      },
    };
  }

  async findOne(
    uuid: string,
    withRelations = false,
    currentUser?: any,
  ): Promise<EmployeeList> {
    const record =
      await this.employeeListModel.findOne({
        where: { uuid } as any,
        include: withRelations
          ? (this.relationIncludes as any)
          : undefined,
      });

    if (!record) {
      throw new NotFoundException(
        `Employee #${uuid} not found`,
      );
    }

    return record;
  }

  async update(uuid: string, dto: UpdateEmployeeListDto, userId?: number, currentUser?: any): Promise<EmployeeList> {
    const record =
      await this.employeeListModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Employee #${uuid} not found`,
      );
    }

    if (
      dto.employeeCode &&
      dto.employeeCode !== record.employeeCode
    ) {
      await this.ensureCodeAvailable(
        dto.employeeCode,
        uuid,
      );
    }

    this.validateDates(
      dto.joiningDate ?? record.joiningDate,
      dto.leaveDate !== undefined
        ? dto.leaveDate
        : record.leaveDate,
    );

    await this.ensureRelationsExist(dto, record);

    await record.update({
      ...dto,
      updatedBy:
        dto.addedById ?? record.updatedBy,
    } as any);

    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const record =
      await this.employeeListModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Employee #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await record.update({
      status: EmployeeListStatus.INACTIVE,
      deletedBy: userId ? String(userId) : null,
    } as any);

    await record.destroy();

    return {
      message: `Employee #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<EmployeeList> {
    const record =
      await this.employeeListModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!record) {
      throw new NotFoundException(
        `Employee #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `Employee #${uuid} is not deleted`,
      );
    }

    // status → active + restore
    await record.restore();
    await record.update({
      status: EmployeeListStatus.ACTIVE,
      deletedBy: null,
      updatedBy: userId ? String(userId) : null,
    } as any);

    return this.findOne(uuid);
  }
}
