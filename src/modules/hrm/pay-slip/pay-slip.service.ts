import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import type { JwtAuthUser } from 'src/common/types/jwt-user.type';
import {
  Attendance,
  AttendanceType,
} from 'src/database/models/hrm/employee/hrm_attendance_model';
import {
  EmployeeList,
  EmployeeListStatus,
} from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { PaySlip } from 'src/database/models/hrm/employee/hrm_pay_slip_model';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

@Injectable()
export class PaySlipService {
  constructor(
    @InjectModel(PaySlip)
    private readonly paySlipModel: typeof PaySlip,
    @InjectModel(EmployeeList)
    private readonly employeeModel: typeof EmployeeList,
    @InjectModel(Attendance)
    private readonly attendanceModel: typeof Attendance,
  ) {}

  private organizationWhere(user: JwtAuthUser) {
    const orgId = user.orgId;
    if (!orgId && !user.isSuperUser)
      throw new ForbiddenException(
        'An organization is required for payroll operations.',
      );
    return orgId ? { orgId } : {};
  }

  private parsePeriod(
    month: unknown,
    year: unknown,
  ) {
    const monthName = String(month ?? '');
    const monthIndex = months.findIndex(
      (item) =>
        item.toLowerCase() ===
        monthName.toLowerCase(),
    );
    const yearNumber = Number(year);
    if (
      monthIndex < 0 ||
      !Number.isInteger(yearNumber) ||
      yearNumber < 2000 ||
      yearNumber > 2200
    )
      throw new BadRequestException(
        'Choose a valid month and year.',
      );
    return {
      month: months[monthIndex],
      monthIndex,
      year: yearNumber,
    };
  }

  async processPeriod(
    input: { month?: unknown; year?: unknown },
    user: JwtAuthUser,
  ) {
    const period = this.parsePeriod(
      input.month,
      input.year,
    );
    const orgWhere = this.organizationWhere(user);
    const from = new Date(
      Date.UTC(period.year, period.monthIndex, 1),
    )
      .toISOString()
      .slice(0, 10);
    const to = new Date(
      Date.UTC(
        period.year,
        period.monthIndex + 1,
        0,
      ),
    )
      .toISOString()
      .slice(0, 10);
    const [employees, attendance] =
      await Promise.all([
        this.employeeModel.findAll({
          where: {
            ...orgWhere,
            status: EmployeeListStatus.ACTIVE,
          },
          order: [['name', 'ASC']],
        }),
        this.attendanceModel.findAll({
          where: {
            ...orgWhere,
            date: { [Op.between]: [from, to] },
            type: AttendanceType.WORKDAY,
          },
        }),
      ]);
    const attendanceByEmployee = new Map<
      string,
      { workingDays: number; absentDays: number }
    >();
    attendance.forEach((row) => {
      const current = attendanceByEmployee.get(
        row.employeeId,
      ) || { workingDays: 0, absentDays: 0 };
      current.workingDays += 1;
      if (!row.isPresent) current.absentDays += 1;
      attendanceByEmployee.set(
        row.employeeId,
        current,
      );
    });
    const generated = [];
    for (const employee of employees) {
      const attend = attendanceByEmployee.get(
        employee.uuid,
      ) || { workingDays: 0, absentDays: 0 };
      const grossSalary =
        Number(employee.grossSalary) || 0;
      const absentAmount =
        attend.workingDays > 0
          ? Math.min(
              grossSalary,
              Math.round(
                (grossSalary /
                  attend.workingDays) *
                  attend.absentDays *
                  100,
              ) / 100,
            )
          : 0;
      const values = {
        employeeId: employee.uuid,
        employeeCode: employee.employeeCode,
        employeeName: employee.name,
        month: period.month,
        year: period.year,
        grossSalary,
        workingDays: attend.workingDays,
        absentDays: attend.absentDays,
        absentAmount,
        deduction: absentAmount,
        netSalary: Math.max(
          0,
          Math.round(
            (grossSalary - absentAmount) * 100,
          ) / 100,
        ),
        status: 'Generated',
        generatedAt: new Date(),
        createdBy: user.id
          ? String(user.id)
          : undefined,
        ...orgWhere,
      };
      const existing =
        await this.paySlipModel.findOne({
          where: {
            ...orgWhere,
            employeeId: employee.uuid,
            month: period.month,
            year: period.year,
          },
        });
      if (existing) {
        await existing.update({
          ...values,
          bankPayableAmount: 0,
          cashPayableAmount: 0,
        });
        generated.push(existing);
      } else {
        generated.push(
          await this.paySlipModel.create(
            values as never,
          ),
        );
      }
    }
    return {
      month: period.month,
      year: period.year,
      data: generated,
      meta: { total: generated.length },
    };
  }

  async list(
    query: {
      month?: string;
      year?: string;
      search?: string;
      bankOnly?: string;
    },
    user: JwtAuthUser,
  ) {
    const orgWhere = this.organizationWhere(user);
    const where: Record<string, unknown> = {
      ...orgWhere,
    };
    if (query.month) {
      const monthIndex = months.findIndex(
        (item) =>
          item.toLowerCase() ===
          query.month!.toLowerCase(),
      );
      if (monthIndex < 0)
        throw new BadRequestException(
          'Choose a valid month.',
        );
      where.month = months[monthIndex];
    }
    if (query.year) {
      const year = Number(query.year);
      if (
        !Number.isInteger(year) ||
        year < 2000 ||
        year > 2200
      )
        throw new BadRequestException(
          'Choose a valid year.',
        );
      where.year = year;
    }
    if (query.bankOnly === 'true')
      where.bankPayableAmount = { [Op.gt]: 0 };
    const rows = await this.paySlipModel.findAll({
      where: where as never,
      order: [
        ['year', 'DESC'],
        ['month', 'ASC'],
        ['employeeName', 'ASC'],
      ],
    });
    const result = query.search
      ? rows.filter((row) =>
          `${row.employeeName} ${row.employeeCode} ${row.month} ${row.year}`
            .toLowerCase()
            .includes(
              query.search!.toLowerCase(),
            ),
        )
      : rows;
    return {
      data: result,
      meta: { total: result.length },
    };
  }

  async updatePaymentSplit(
    uuid: string,
    input: {
      bankPayableAmount?: number;
      cashPayableAmount?: number;
    },
    user: JwtAuthUser,
  ) {
    const orgWhere = this.organizationWhere(user);
    const row = await this.paySlipModel.findOne({
      where: { ...orgWhere, uuid } as never,
    });
    if (!row)
      throw new NotFoundException(
        'Pay slip was not found.',
      );
    const bank = Number(input.bankPayableAmount);
    const cash = Number(input.cashPayableAmount);
    if (
      !Number.isFinite(bank) ||
      !Number.isFinite(cash) ||
      bank < 0 ||
      cash < 0
    )
      throw new BadRequestException(
        'Bank and cash amounts must be non-negative numbers.',
      );
    if (
      Math.round((bank + cash) * 100) !==
      Math.round(Number(row.netSalary) * 100)
    )
      throw new BadRequestException(
        'Bank and cash amounts must add up to the net salary.',
      );
    await row.update({
      bankPayableAmount: bank,
      cashPayableAmount: cash,
      status: 'Allocated',
    });
    return row;
  }
}
