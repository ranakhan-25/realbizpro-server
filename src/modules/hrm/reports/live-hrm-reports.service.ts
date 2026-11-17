import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Attendance } from 'src/database/models/hrm/employee/hrm_attendance_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { PaySlip } from 'src/database/models/hrm/employee/hrm_pay_slip_model';
import { LeaveApplication } from 'src/database/models/hrm/leaveapplication/leaveapplication_modes';

type Plain = Record<string, unknown>;
const reportTitles: Record<string, string> = {
  'salary-sheet': 'Salary Sheet',
  'attendance-summary': 'Attendance Summary',
  'salary-due-report': 'Salary Due Report',
  'job-card': 'Job Card',
  'daily-manpower-report':
    'Daily Manpower Report',
  'leave-report': 'Leave Report',
  'attendance-register': 'Attendance Register',
  'daily-attendance-report':
    'Daily Attendance Report',
  'leave-details-report': 'Leave Details Report',
  'attendance-details-report':
    'Attendance Details Report',
  'deduction-report': 'Deduction Report',
};
const money = (value: unknown) =>
  Number(value ?? 0) || 0;
const text = (value: unknown) =>
  String(value ?? '');
const toPlain = (row: {
  toJSON: () => unknown;
}) => row.toJSON() as Plain;

@Injectable()
export class LiveHrmReportsService {
  constructor(
    @InjectModel(Attendance)
    private readonly attendanceModel: typeof Attendance,
    @InjectModel(EmployeeList)
    private readonly employeeModel: typeof EmployeeList,
    @InjectModel(PaySlip)
    private readonly paySlipModel: typeof PaySlip,
    @InjectModel(LeaveApplication)
    private readonly leaveModel: typeof LeaveApplication,
  ) {}

  async generate(
    reportKey: string,
    query: Record<string, string | undefined>,
    user: Plain,
  ) {
    const title = reportTitles[reportKey];
    if (!title)
      throw new BadRequestException(
        `Unknown HRM report: ${reportKey}`,
      );
    const orgId = user.orgId;
    if (!orgId && !user.isSuperUser)
      throw new ForbiddenException(
        'An organization is required to view HRM reports.',
      );
    for (const date of [
      query.fromDate,
      query.toDate,
    ])
      if (date && Number.isNaN(Date.parse(date)))
        throw new BadRequestException(
          'Report dates must be valid ISO dates.',
        );
    const scope = orgId ? { orgId } : {};
    const attendanceWhere: Record<
      PropertyKey,
      unknown
    > = { ...scope };
    if (query.fromDate || query.toDate) {
      const date: Record<PropertyKey, unknown> =
        {};
      if (query.fromDate)
        date[Op.gte] = query.fromDate;
      if (query.toDate)
        date[Op.lte] = query.toDate;
      attendanceWhere.date = date;
    }
    if (query.employeeId)
      attendanceWhere.employeeId =
        query.employeeId;
    const leaveWhere: Record<
      PropertyKey,
      unknown
    > = { ...scope };
    if (query.fromDate || query.toDate) {
      leaveWhere.fromDate = {
        [Op.lte]: query.toDate || '9999-12-31',
      };
      leaveWhere.toDate = {
        [Op.gte]: query.fromDate || '1900-01-01',
      };
    }
    if (query.employeeId)
      leaveWhere.employeeId = query.employeeId;
    const payWhere: Record<PropertyKey, unknown> =
      { ...scope };
    if (query.employeeId)
      payWhere.employeeId = query.employeeId;
    if (query.month) payWhere.month = query.month;
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
      payWhere.year = year;
    }
    if (query.fromDate || query.toDate) {
      const from = query.fromDate
        ? new Date(`${query.fromDate}T00:00:00Z`)
        : new Date('2000-01-01T00:00:00Z');
      const to = query.toDate
        ? new Date(`${query.toDate}T00:00:00Z`)
        : new Date('2200-12-31T00:00:00Z');
      const monthIndex = (month: string) =>
        months.indexOf(month);
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
      const startYear = from.getUTCFullYear();
      const endYear = to.getUTCFullYear();
      payWhere[Op.or] = Array.from(
        {
          length: Math.max(
            0,
            endYear - startYear + 1,
          ),
        },
        (_, offset) => {
          const year = startYear + offset;
          const firstMonth =
            year === startYear
              ? from.getUTCMonth()
              : 0;
          const lastMonth =
            year === endYear
              ? to.getUTCMonth()
              : 11;
          return {
            year,
            month: {
              [Op.in]: months.slice(
                firstMonth,
                lastMonth + 1,
              ),
            },
          };
        },
      );
    }
    const [
      attendance,
      employees,
      paySlips,
      leaves,
    ] = await Promise.all([
      this.attendanceModel.findAll({
        where: attendanceWhere as never,
        order: [['date', 'ASC']],
      }),
      this.employeeModel.findAll({
        where: scope as never,
        order: [['name', 'ASC']],
      }),
      this.paySlipModel.findAll({
        where: payWhere as never,
        order: [
          ['year', 'DESC'],
          ['month', 'ASC'],
        ],
      }),
      this.leaveModel.findAll({
        where: leaveWhere as never,
        order: [['fromDate', 'DESC']],
      }),
    ]);
    const employeeMap = new Map(
      employees.map((model) => {
        const e = toPlain(model);
        return [text(e.uuid), e];
      }),
    );
    const attendanceRows: Plain[] =
      attendance.map((model) => {
        const row = toPlain(model);
        const employee =
          employeeMap.get(text(row.employeeId)) ||
          {};
        return {
          date: row.date,
          employeeId: row.employeeId,
          employeeCode: employee.employeeCode,
          employeeName: employee.name,
          department: employee.departmentId,
          designation: employee.designationId,
          day: row.day,
          attendanceType: row.type,
          status: row.isPresent
            ? 'Present'
            : 'Absent',
          isPresent: row.isPresent,
          inTime: row.inTime,
          outTime: row.outTime,
          hours: row.hours,
          note: row.note || row.comment,
        };
      });
    const leaveRows: Plain[] = leaves.map(
      (model) => {
        const row = toPlain(model);
        const employee =
          employeeMap.get(text(row.employeeId)) ||
          {};
        return {
          employeeId: row.employeeId,
          employeeCode: employee.employeeCode,
          employeeName: employee.name,
          leaveTypeId: row.leaveTypeId,
          fromDate: row.fromDate,
          toDate: row.toDate,
          allocatedDays: row.allocatedDays,
          balanceDays: row.balanceDays,
          status: row.status,
          reason: row.reason,
        };
      },
    );
    const salaryRows: Plain[] = paySlips.map(
      (model) => {
        const row = toPlain(model);
        const netSalary = money(row.netSalary);
        const paid =
          money(row.bankPayableAmount) +
          money(row.cashPayableAmount);
        return {
          uuid: row.uuid,
          employeeId: row.employeeId,
          employeeCode: row.employeeCode,
          employeeName: row.employeeName,
          month: row.month,
          year: row.year,
          grossSalary: money(row.grossSalary),
          absentDays: row.absentDays,
          absentAmount: money(row.absentAmount),
          deduction: money(row.deduction),
          netSalary,
          bankPayableAmount: money(
            row.bankPayableAmount,
          ),
          cashPayableAmount: money(
            row.cashPayableAmount,
          ),
          dueAmount: Math.max(
            0,
            netSalary - paid,
          ),
          status: row.status,
          generatedAt: row.generatedAt,
        };
      },
    );
    const key = reportKey.toLowerCase();
    let rows: Plain[];
    if (key === 'salary-sheet') rows = salaryRows;
    else if (key === 'salary-due-report')
      rows = salaryRows.filter(
        (row) => money(row.dueAmount) > 0,
      );
    else if (key === 'deduction-report')
      rows = salaryRows.filter(
        (row) => money(row.deduction) > 0,
      );
    else if (key.includes('leave'))
      rows = leaveRows;
    else if (key === 'daily-manpower-report') {
      const byDay = new Map<
        string,
        {
          date: string;
          present: number;
          absent: number;
          total: number;
        }
      >();
      attendanceRows.forEach((row) => {
        const date = text(row.date);
        const group = byDay.get(date) || {
          date,
          present: 0,
          absent: 0,
          total: 0,
        };
        group.total += 1;
        if (row.isPresent) group.present += 1;
        else group.absent += 1;
        byDay.set(date, group);
      });
      rows = [...byDay.values()].map((row) => ({
        ...row,
        attendanceRate: row.total
          ? Number(
              (
                (row.present / row.total) *
                100
              ).toFixed(2),
            )
          : 0,
      }));
    } else if (key === 'attendance-summary') {
      const byEmployee = new Map<
        string,
        {
          employeeId: string;
          employeeCode: string;
          employeeName: string;
          present: number;
          absent: number;
          workingDays: number;
        }
      >();
      attendanceRows.forEach((row) => {
        const id = text(row.employeeId);
        const group = byEmployee.get(id) || {
          employeeId: id,
          employeeCode: text(row.employeeCode),
          employeeName: text(row.employeeName),
          present: 0,
          absent: 0,
          workingDays: 0,
        };
        if (row.attendanceType === 'workday') {
          group.workingDays += 1;
          if (row.isPresent) group.present += 1;
          else group.absent += 1;
        }
        byEmployee.set(id, group);
      });
      rows = [...byEmployee.values()].map(
        (row) => ({
          ...row,
          attendanceRate: row.workingDays
            ? Number(
                (
                  (row.present /
                    row.workingDays) *
                  100
                ).toFixed(2),
              )
            : 0,
        }),
      );
    } else rows = attendanceRows;
    if (query.search)
      rows = rows.filter((row) =>
        Object.values(row).some((value) =>
          text(value)
            .toLowerCase()
            .includes(
              query.search!.toLowerCase(),
            ),
        ),
      );
    const summary = {
      records: rows.length,
      grossSalary: rows.reduce(
        (sum, row) =>
          sum + money(row.grossSalary),
        0,
      ),
      deduction: rows.reduce(
        (sum, row) => sum + money(row.deduction),
        0,
      ),
      netSalary: rows.reduce(
        (sum, row) => sum + money(row.netSalary),
        0,
      ),
      present: rows.reduce(
        (sum, row) => sum + money(row.present),
        0,
      ),
      absent: rows.reduce(
        (sum, row) => sum + money(row.absent),
        0,
      ),
      dueAmount: rows.reduce(
        (sum, row) => sum + money(row.dueAmount),
        0,
      ),
    };
    return {
      reportKey,
      title,
      generatedAt: new Date().toISOString(),
      filters: {
        fromDate: query.fromDate || null,
        toDate: query.toDate || null,
        month: query.month || null,
        year: query.year || null,
      },
      summary,
      data: rows,
      meta: { total: rows.length },
    };
  }
}
