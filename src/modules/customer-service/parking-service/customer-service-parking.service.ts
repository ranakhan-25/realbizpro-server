import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CsParkingSlot } from 'src/database/models/customer-service/cs_parking_slot.model';
import { CsParkingAssignment } from 'src/database/models/customer-service/cs_parking_assignment.model';
import { CsParkingExternalRental } from 'src/database/models/customer-service/cs_parking_external_rental.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { extractUserContext } from '../common/customer-service-context.helper';
import {
  CreateParkingSlotDto,
  UpdateParkingSlotDto,
  QueryParkingSlotDto,
  CreateParkingAssignmentDto,
  ReleaseParkingAssignmentDto,
  QueryParkingAssignmentDto,
  CreateExternalRentalDto,
  CollectRentalPaymentDto,
  TerminateExternalRentalDto,
  QueryExternalRentalDto,
} from './dto';

// Pure snake_case mappers
export function toSnakeCaseSlot(item: CsParkingSlot) {
  const activeAssignment = item.assignments?.find?.((a) => a.isActive);
  const activeRental = item.rentals?.find?.((r) => r.status === 'ACTIVE');

  return {
    id: item.id,
    uuid: item.uuid,
    organization_id: item.organizationId ?? null,
    project_id: item.projectId ?? null,
    project_name: item.project?.name ?? null,
    slot_number: item.slotNumber,
    floor_zone: item.floorZone,
    allowed_vehicle_type: item.allowedVehicleType,
    status: item.status,
    notes: item.notes ?? null,
    current_occupant: activeAssignment
      ? {
          type: 'RESIDENT',
          assignment_id: activeAssignment.id,
          assignment_uuid: activeAssignment.uuid,
          flat_number: activeAssignment.flatNumber,
          resident_name: activeAssignment.residentName,
          resident_phone: activeAssignment.residentPhone ?? null,
          vehicle_number: activeAssignment.vehicleNumber,
          vehicle_type: activeAssignment.vehicleType,
          rfid_tag: activeAssignment.rfidTag ?? null,
          start_date: activeAssignment.startDate,
        }
      : activeRental
      ? {
          type: 'EXTERNAL_RENTER',
          rental_id: activeRental.id,
          rental_uuid: activeRental.uuid,
          renter_name: activeRental.renterName,
          renter_phone: activeRental.renterPhone,
          vehicle_number: activeRental.vehicleNumber,
          vehicle_type: activeRental.vehicleType,
          monthly_rent: Number(activeRental.monthlyRent || 0),
          monthly_rent_formatted: `৳ ${Number(activeRental.monthlyRent || 0).toLocaleString('en-IN')}`,
          payment_status: activeRental.paymentStatus,
          start_date: activeRental.startDate,
        }
      : null,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

export function toSnakeCaseAssignment(item: CsParkingAssignment) {
  return {
    id: item.id,
    uuid: item.uuid,
    organization_id: item.organizationId ?? null,
    project_id: item.projectId ?? null,
    project_name: item.project?.name ?? null,
    slot_id: item.slotId,
    slot_number: item.slot?.slotNumber ?? null,
    floor_zone: item.slot?.floorZone ?? null,
    flat_number: item.flatNumber,
    resident_name: item.residentName,
    resident_phone: item.residentPhone ?? null,
    vehicle_number: item.vehicleNumber,
    vehicle_type: item.vehicleType,
    rfid_tag: item.rfidTag ?? null,
    start_date: item.startDate,
    end_date: item.endDate ?? null,
    is_active: item.isActive,
    release_date: item.releaseDate ?? null,
    release_reason: item.releaseReason ?? null,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

export function toSnakeCaseExternalRental(item: CsParkingExternalRental) {
  const monthlyRent = Number(item.monthlyRent || 0);
  const amountCollected = Number(item.amountCollected || 0);
  const balanceDue = Math.max(0, monthlyRent - amountCollected);

  return {
    id: item.id,
    uuid: item.uuid,
    organization_id: item.organizationId ?? null,
    project_id: item.projectId ?? null,
    project_name: item.project?.name ?? null,
    slot_id: item.slotId,
    slot_number: item.slot?.slotNumber ?? null,
    floor_zone: item.slot?.floorZone ?? null,
    renter_name: item.renterName,
    renter_phone: item.renterPhone,
    renter_nid: item.renterNid ?? null,
    vehicle_number: item.vehicleNumber,
    vehicle_type: item.vehicleType,
    monthly_rent: monthlyRent,
    monthly_rent_formatted: `৳ ${monthlyRent.toLocaleString('en-IN')}`,
    deposit_amount: Number(item.depositAmount || 0),
    deposit_amount_formatted: `৳ ${Number(item.depositAmount || 0).toLocaleString('en-IN')}`,
    start_date: item.startDate,
    end_date: item.endDate ?? null,
    payment_status: item.paymentStatus,
    amount_collected: amountCollected,
    amount_collected_formatted: `৳ ${amountCollected.toLocaleString('en-IN')}`,
    balance_due: balanceDue,
    balance_due_formatted: `৳ ${balanceDue.toLocaleString('en-IN')}`,
    last_payment_date: item.lastPaymentDate ?? null,
    status: item.status,
    notes: item.notes ?? null,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

@Injectable()
export class CustomerServiceParkingService {
  private readonly logger = new Logger(CustomerServiceParkingService.name);

  constructor(
    @InjectModel(CsParkingSlot)
    private readonly slotModel: typeof CsParkingSlot,
    @InjectModel(CsParkingAssignment)
    private readonly assignmentModel: typeof CsParkingAssignment,
    @InjectModel(CsParkingExternalRental)
    private readonly rentalModel: typeof CsParkingExternalRental,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
  ) {}

  // Helper to validate and build scoped organization where-clause
  private buildOrgWhere(user: any): Record<string, any> {
    const ctx = extractUserContext(user);
    if (!ctx.isSuperAdmin && ctx.orgId) {
      return { organizationId: ctx.orgId };
    }
    return {};
  }

  // =========================================================================
  // 1. PARKING SLOTS
  // =========================================================================

  async createSlot(user: any, dto: CreateParkingSlotDto) {
    const ctx = extractUserContext(user);
    const orgId = ctx.orgId;

    // 1. Verify project exists
    const proj = await this.projectModel.findOne({
      where: {
        uuid: dto.project_id,
      } as any,
    });
    if (!proj) {
      throw new NotFoundException(`Project ${dto.project_id} not found`);
    }

    // 2. Check slot number uniqueness within project
    const existing = await this.slotModel.findOne({
      where: {
        projectId: dto.project_id,
        slotNumber: dto.slot_number.trim(),
        ...(orgId && !ctx.isSuperAdmin ? { organizationId: orgId } : {}),
      },
    });
    if (existing) {
      throw new BadRequestException(
        `Parking slot "${dto.slot_number}" already exists for project ${proj.name}`,
      );
    }

    const slot = await this.slotModel.create({
      organizationId: orgId,
      projectId: dto.project_id,
      slotNumber: dto.slot_number.trim(),
      floorZone: dto.floor_zone?.trim() || 'Ground Floor',
      allowedVehicleType: dto.allowed_vehicle_type || 'Car',
      status: dto.status || 'FREE',
      notes: dto.notes?.trim() || null,
      createdBy: ctx.userId ?? null,
    } as any);

    return toSnakeCaseSlot(slot);
  }

  async getSlots(user: any, query: QueryParkingSlotDto) {
    const orgWhere = this.buildOrgWhere(user);
    const where: any = { ...orgWhere };

    if (query.project_id && query.project_id !== 'all') {
      where.projectId = query.project_id;
    }

    if (query.floor_zone && query.floor_zone !== 'all') {
      where.floorZone = query.floor_zone;
    }

    if (query.status && query.status !== 'all') {
      where.status = query.status;
    }

    if (query.allowed_vehicle_type && query.allowed_vehicle_type !== 'all') {
      where.allowedVehicleType = query.allowed_vehicle_type;
    }

    if (query.search?.trim()) {
      const s = `%${query.search.trim()}%`;
      where[Op.or] = [
        { slotNumber: { [Op.iLike]: s } },
        { floorZone: { [Op.iLike]: s } },
        { notes: { [Op.iLike]: s } },
      ];
    }

    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.max(1, Math.min(100, Number(query.limit || 10)));
    const offset = (page - 1) * limit;

    const { rows, count } = await this.slotModel.findAndCountAll({
      where,
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['id', 'uuid', 'name', 'code'],
          required: false,
        },
        {
          model: this.assignmentModel,
          as: 'assignments',
          where: { isActive: true },
          required: false,
        },
        {
          model: this.rentalModel,
          as: 'rentals',
          where: { status: 'ACTIVE' },
          required: false,
        },
      ],
      order: [['slotNumber', 'ASC']],
      limit,
      offset,
    });

    return {
      items: rows.map(toSnakeCaseSlot),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit) || 1,
      },
    };
  }

  async getSlotByUuid(user: any, uuid: string) {
    const orgWhere = this.buildOrgWhere(user);
    const slot = await this.slotModel.findOne({
      where: { uuid, ...orgWhere } as any,
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['id', 'uuid', 'name', 'code'],
          required: false,
        },
        {
          model: this.assignmentModel,
          as: 'assignments',
          where: { isActive: true },
          required: false,
        },
        {
          model: this.rentalModel,
          as: 'rentals',
          where: { status: 'ACTIVE' },
          required: false,
        },
      ],
    });

    if (!slot) {
      throw new NotFoundException(`Parking slot ${uuid} not found in your organization`);
    }

    return toSnakeCaseSlot(slot);
  }

  async updateSlot(user: any, uuid: string, dto: UpdateParkingSlotDto) {
    const orgWhere = this.buildOrgWhere(user);
    const slot = await this.slotModel.findOne({
      where: { uuid, ...orgWhere } as any,
    });

    if (!slot) {
      throw new NotFoundException(`Parking slot ${uuid} not found in your organization`);
    }

    if (dto.slot_number && dto.slot_number.trim() !== slot.slotNumber) {
      const existing = await this.slotModel.findOne({
        where: {
          projectId: slot.projectId,
          slotNumber: dto.slot_number.trim(),
          id: { [Op.ne]: slot.id },
          ...orgWhere,
        } as any,
      });
      if (existing) {
        throw new BadRequestException(
          `Slot number "${dto.slot_number}" is already used in this project`,
        );
      }
      slot.slotNumber = dto.slot_number.trim();
    }

    if (dto.floor_zone !== undefined) slot.floorZone = dto.floor_zone.trim();
    if (dto.allowed_vehicle_type !== undefined) slot.allowedVehicleType = dto.allowed_vehicle_type;
    if (dto.status !== undefined) slot.status = dto.status;
    if (dto.notes !== undefined) slot.notes = dto.notes?.trim() || null;

    const ctx = extractUserContext(user);
    slot.updatedBy = ctx.userId ?? null;

    await slot.save();
    return toSnakeCaseSlot(slot);
  }

  async deleteSlot(user: any, uuid: string) {
    const orgWhere = this.buildOrgWhere(user);
    const slot = await this.slotModel.findOne({
      where: { uuid, ...orgWhere } as any,
    });

    if (!slot) {
      throw new NotFoundException(`Parking slot ${uuid} not found in your organization`);
    }

    if (slot.status === 'OCCUPIED') {
      throw new BadRequestException(
        `Cannot delete slot ${slot.slotNumber}: currently OCCUPIED by resident. Please release assignment first.`,
      );
    }
    if (slot.status === 'RENTED_EXTERNAL') {
      throw new BadRequestException(
        `Cannot delete slot ${slot.slotNumber}: currently RENTED_EXTERNAL. Please terminate rental first.`,
      );
    }

    const ctx = extractUserContext(user);
    await slot.update({ deletedBy: ctx.userId ?? null });
    await slot.destroy();
    return { success: true, message: `Parking slot ${slot.slotNumber} deleted successfully` };
  }

  // =========================================================================
  // 2. PARKING ASSIGNMENTS (Resident Flat Owners)
  // =========================================================================

  async createAssignment(user: any, dto: CreateParkingAssignmentDto) {
    const ctx = extractUserContext(user);
    const orgId = ctx.orgId;

    // 1. Verify project exists
    const proj = await this.projectModel.findOne({
      where: {
        uuid: dto.project_id,
      } as any,
    });
    if (!proj) {
      throw new NotFoundException(`Project ${dto.project_id} not found`);
    }

    // 2. Find slot
    const slot = await this.slotModel.findOne({
      where: {
        id: dto.slot_id,
        projectId: dto.project_id,
        ...(orgId && !ctx.isSuperAdmin ? { organizationId: orgId } : {}),
      },
    });
    if (!slot) {
      throw new NotFoundException(
        `Parking slot ID ${dto.slot_id} not found in project ${dto.project_id}`,
      );
    }

    // 3. Block Double Assignment! Check slot availability
    const activeAssignment = await this.assignmentModel.findOne({
      where: {
        slotId: dto.slot_id,
        isActive: true,
      },
    });
    if (activeAssignment) {
      throw new BadRequestException(
        `Slot "${slot.slotNumber}" is already occupied by ${activeAssignment.residentName} (${activeAssignment.flatNumber}, vehicle ${activeAssignment.vehicleNumber}). Double assignment is blocked.`,
      );
    }

    const activeRental = await this.rentalModel.findOne({
      where: {
        slotId: dto.slot_id,
        status: 'ACTIVE',
      },
    });
    if (activeRental) {
      throw new BadRequestException(
        `Slot "${slot.slotNumber}" is currently rented externally to ${activeRental.renterName}. Release external rental before assigning to resident.`,
      );
    }

    // 4. Create assignment
    const assignment = await this.assignmentModel.create({
      organizationId: orgId,
      projectId: dto.project_id,
      slotId: dto.slot_id,
      flatNumber: dto.flat_number.trim(),
      residentName: dto.resident_name.trim(),
      residentPhone: dto.resident_phone?.trim() || null,
      vehicleNumber: dto.vehicle_number.trim(),
      vehicleType: dto.vehicle_type || 'Car',
      rfidTag: dto.rfid_tag?.trim() || null,
      startDate: dto.start_date,
      endDate: dto.end_date || null,
      isActive: true,
      createdBy: ctx.userId ?? null,
    } as any);

    // 5. Update slot status to OCCUPIED
    slot.status = 'OCCUPIED';
    await slot.save();

    // Reload with associations
    const reloaded = await this.assignmentModel.findByPk(assignment.id, {
      include: [
        { model: this.projectModel, as: 'project', attributes: ['id', 'uuid', 'name', 'code'], required: false },
        { model: this.slotModel, as: 'slot', attributes: ['id', 'uuid', 'slotNumber', 'floorZone'], required: false },
      ],
    });

    return toSnakeCaseAssignment(reloaded || assignment);
  }

  async releaseAssignment(user: any, uuid: string, dto: ReleaseParkingAssignmentDto) {
    const orgWhere = this.buildOrgWhere(user);
    const assignment = await this.assignmentModel.findOne({
      where: { uuid, ...orgWhere } as any,
      include: [{ model: this.slotModel, as: 'slot', required: false }],
    });

    if (!assignment) {
      throw new NotFoundException(`Parking assignment ${uuid} not found in your organization`);
    }

    if (!assignment.isActive) {
      throw new BadRequestException('This parking assignment is already released');
    }

    const today = new Date().toISOString().slice(0, 10);
    const ctx = extractUserContext(user);
    assignment.isActive = false;
    assignment.releaseDate = dto.release_date || today;
    assignment.releaseReason = dto.release_reason?.trim() || 'Released by management';
    assignment.updatedBy = ctx.userId ?? null;
    await assignment.save();

    // Restore slot status to FREE
    if (assignment.slotId) {
      const slot = await this.slotModel.findByPk(assignment.slotId);
      if (slot && slot.status === 'OCCUPIED') {
        slot.status = 'FREE';
        slot.updatedBy = ctx.userId ?? null;
        await slot.save();
      }
    }

    return toSnakeCaseAssignment(assignment);
  }

  async getAssignments(user: any, query: QueryParkingAssignmentDto) {
    const orgWhere = this.buildOrgWhere(user);
    const where: any = { ...orgWhere };

    if (query.project_id && query.project_id !== 'all') {
      where.projectId = query.project_id;
    }

    if (query.slot_id) {
      where.slotId = query.slot_id;
    }

    if (query.is_active !== undefined && query.is_active !== 'all') {
      where.isActive = query.is_active === 'true';
    }

    if (query.search?.trim()) {
      const s = `%${query.search.trim()}%`;
      where[Op.or] = [
        { flatNumber: { [Op.iLike]: s } },
        { residentName: { [Op.iLike]: s } },
        { residentPhone: { [Op.iLike]: s } },
        { vehicleNumber: { [Op.iLike]: s } },
        { rfidTag: { [Op.iLike]: s } },
      ];
    }

    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.max(1, Math.min(100, Number(query.limit || 10)));
    const offset = (page - 1) * limit;

    const { rows, count } = await this.assignmentModel.findAndCountAll({
      where,
      include: [
        { model: this.projectModel, as: 'project', attributes: ['id', 'uuid', 'name', 'code'], required: false },
        { model: this.slotModel, as: 'slot', attributes: ['id', 'uuid', 'slotNumber', 'floorZone'], required: false },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return {
      items: rows.map(toSnakeCaseAssignment),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit) || 1,
      },
    };
  }

  async getAssignmentByUuid(user: any, uuid: string) {
    const orgWhere = this.buildOrgWhere(user);
    const assignment = await this.assignmentModel.findOne({
      where: { uuid, ...orgWhere } as any,
      include: [
        { model: this.projectModel, as: 'project', attributes: ['id', 'uuid', 'name', 'code'], required: false },
        { model: this.slotModel, as: 'slot', attributes: ['id', 'uuid', 'slotNumber', 'floorZone'], required: false },
      ],
    });

    if (!assignment) {
      throw new NotFoundException(`Parking assignment ${uuid} not found in your organization`);
    }

    return toSnakeCaseAssignment(assignment);
  }

  // =========================================================================
  // 3. EXTERNAL RENTALS (Outsider Rentals Funding Building Maintenance)
  // =========================================================================

  async createExternalRental(user: any, dto: CreateExternalRentalDto) {
    const ctx = extractUserContext(user);
    const orgId = ctx.orgId;

    // 1. Verify project exists
    const proj = await this.projectModel.findOne({
      where: {
        uuid: dto.project_id,
      } as any,
    });
    if (!proj) {
      throw new NotFoundException(`Project ${dto.project_id} not found`);
    }

    // 2. Find slot
    const slot = await this.slotModel.findOne({
      where: {
        id: dto.slot_id,
        projectId: dto.project_id,
        ...(orgId && !ctx.isSuperAdmin ? { organizationId: orgId } : {}),
      },
    });
    if (!slot) {
      throw new NotFoundException(
        `Parking slot ID ${dto.slot_id} not found in project ${dto.project_id}`,
      );
    }

    // 3. Block double rental / assignment
    if (slot.status !== 'FREE') {
      throw new BadRequestException(
        `Slot "${slot.slotNumber}" is currently ${slot.status} and cannot be rented externally.`,
      );
    }

    const activeAssignment = await this.assignmentModel.findOne({
      where: { slotId: dto.slot_id, isActive: true },
    });
    if (activeAssignment) {
      throw new BadRequestException(
        `Slot "${slot.slotNumber}" is already assigned to resident ${activeAssignment.residentName} (${activeAssignment.flatNumber}).`,
      );
    }

    const activeRental = await this.rentalModel.findOne({
      where: { slotId: dto.slot_id, status: 'ACTIVE' },
    });
    if (activeRental) {
      throw new BadRequestException(
        `Slot "${slot.slotNumber}" already has an active external rental for ${activeRental.renterName}.`,
      );
    }

    // 4. Create external rental
    const rental = await this.rentalModel.create({
      organizationId: orgId,
      projectId: dto.project_id,
      slotId: dto.slot_id,
      renterName: dto.renter_name.trim(),
      renterPhone: dto.renter_phone.trim(),
      renterNid: dto.renter_nid?.trim() || null,
      vehicleNumber: dto.vehicle_number.trim(),
      vehicleType: dto.vehicle_type || 'Car',
      monthlyRent: dto.monthly_rent,
      depositAmount: dto.deposit_amount || 0,
      startDate: dto.start_date,
      endDate: dto.end_date || null,
      paymentStatus: 'DUE',
      amountCollected: 0,
      status: 'ACTIVE',
      notes: dto.notes?.trim() || null,
      createdBy: ctx.userId ?? null,
    } as any);

    // 5. Update slot status to RENTED_EXTERNAL
    slot.status = 'RENTED_EXTERNAL';
    await slot.save();

    const reloaded = await this.rentalModel.findByPk(rental.id, {
      include: [
        { model: this.projectModel, as: 'project', attributes: ['id', 'uuid', 'name', 'code'], required: false },
        { model: this.slotModel, as: 'slot', attributes: ['id', 'uuid', 'slotNumber', 'floorZone'], required: false },
      ],
    });

    return toSnakeCaseExternalRental(reloaded || rental);
  }

  async collectRentalPayment(user: any, uuid: string, dto: CollectRentalPaymentDto) {
    const orgWhere = this.buildOrgWhere(user);
    const rental = await this.rentalModel.findOne({
      where: { uuid, ...orgWhere } as any,
      include: [
        { model: this.projectModel, as: 'project', attributes: ['id', 'uuid', 'name', 'code'], required: false },
        { model: this.slotModel, as: 'slot', attributes: ['id', 'uuid', 'slotNumber', 'floorZone'], required: false },
      ],
    });

    if (!rental) {
      throw new NotFoundException(`External rental ${uuid} not found in your organization`);
    }

    const today = new Date().toISOString().slice(0, 10);
    const newCollected = Number(rental.amountCollected || 0) + Number(dto.amount);
    rental.amountCollected = newCollected;
    rental.lastPaymentDate = dto.payment_date || today;

    const monthlyRent = Number(rental.monthlyRent || 0);
    if (newCollected >= monthlyRent) {
      rental.paymentStatus = 'PAID';
    } else if (newCollected > 0) {
      rental.paymentStatus = 'PARTIAL';
    } else {
      rental.paymentStatus = 'DUE';
    }

    if (dto.notes?.trim() || dto.reference?.trim()) {
      const extra = [dto.reference ? `Ref: ${dto.reference}` : '', dto.notes ? dto.notes : '']
        .filter(Boolean)
        .join('; ');
      rental.notes = rental.notes ? `${rental.notes}\n[Payment ${today}] ${extra}` : `[Payment ${today}] ${extra}`;
    }

    const ctx = extractUserContext(user);
    rental.updatedBy = ctx.userId ?? null;

    await rental.save();
    return toSnakeCaseExternalRental(rental);
  }

  async terminateExternalRental(user: any, uuid: string, dto: TerminateExternalRentalDto) {
    const orgWhere = this.buildOrgWhere(user);
    const rental = await this.rentalModel.findOne({
      where: { uuid, ...orgWhere } as any,
      include: [{ model: this.slotModel, as: 'slot', required: false }],
    });

    if (!rental) {
      throw new NotFoundException(`External rental ${uuid} not found in your organization`);
    }

    if (rental.status === 'TERMINATED') {
      throw new BadRequestException('This external rental is already terminated');
    }

    const today = new Date().toISOString().slice(0, 10);
    const ctx = extractUserContext(user);
    rental.status = 'TERMINATED';
    rental.endDate = dto.end_date || today;
    if (dto.notes?.trim()) {
      rental.notes = rental.notes ? `${rental.notes}\n[Terminated ${today}] ${dto.notes}` : `[Terminated ${today}] ${dto.notes}`;
    }
    rental.updatedBy = ctx.userId ?? null;
    await rental.save();

    // Release slot back to FREE
    if (rental.slotId) {
      const slot = await this.slotModel.findByPk(rental.slotId);
      if (slot && slot.status === 'RENTED_EXTERNAL') {
        slot.status = 'FREE';
        slot.updatedBy = ctx.userId ?? null;
        await slot.save();
      }
    }

    return toSnakeCaseExternalRental(rental);
  }

  async getExternalRentals(user: any, query: QueryExternalRentalDto) {
    const orgWhere = this.buildOrgWhere(user);
    const where: any = { ...orgWhere };

    if (query.project_id && query.project_id !== 'all') {
      where.projectId = query.project_id;
    }

    if (query.slot_id) {
      where.slotId = query.slot_id;
    }

    if (query.payment_status && query.payment_status !== 'all') {
      where.paymentStatus = query.payment_status;
    }

    if (query.status && query.status !== 'all') {
      where.status = query.status;
    }

    if (query.search?.trim()) {
      const s = `%${query.search.trim()}%`;
      where[Op.or] = [
        { renterName: { [Op.iLike]: s } },
        { renterPhone: { [Op.iLike]: s } },
        { vehicleNumber: { [Op.iLike]: s } },
        { renterNid: { [Op.iLike]: s } },
      ];
    }

    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.max(1, Math.min(100, Number(query.limit || 10)));
    const offset = (page - 1) * limit;

    const { rows, count } = await this.rentalModel.findAndCountAll({
      where,
      include: [
        { model: this.projectModel, as: 'project', attributes: ['id', 'uuid', 'name', 'code'], required: false },
        { model: this.slotModel, as: 'slot', attributes: ['id', 'uuid', 'slotNumber', 'floorZone'], required: false },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return {
      items: rows.map(toSnakeCaseExternalRental),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit) || 1,
      },
    };
  }

  async getExternalRentalByUuid(user: any, uuid: string) {
    const orgWhere = this.buildOrgWhere(user);
    const rental = await this.rentalModel.findOne({
      where: { uuid, ...orgWhere } as any,
      include: [
        { model: this.projectModel, as: 'project', attributes: ['id', 'uuid', 'name', 'code'], required: false },
        { model: this.slotModel, as: 'slot', attributes: ['id', 'uuid', 'slotNumber', 'floorZone'], required: false },
      ],
    });

    if (!rental) {
      throw new NotFoundException(`External rental ${uuid} not found in your organization`);
    }

    return toSnakeCaseExternalRental(rental);
  }

  // =========================================================================
  // 4. MONTHLY PARKING INCOME SUMMARY & STATS (FEEDS SERVICE CHARGE INCOME)
  // =========================================================================

  async getMonthlyIncomeSummary(user: any, projectId?: string) {
    const orgWhere = this.buildOrgWhere(user);
    const slotWhere: any = { ...orgWhere };
    const rentalWhere: any = { ...orgWhere, status: 'ACTIVE' };

    if (projectId && projectId !== 'all') {
      slotWhere.projectId = projectId;
      rentalWhere.projectId = projectId;
    }

    // 1. Slots inventory breakdown
    const allSlots = await this.slotModel.findAll({
      where: slotWhere,
      attributes: ['id', 'status', 'floorZone'],
    });

    const totalSlots = allSlots.length;
    let freeCount = 0;
    let occupiedCount = 0;
    let rentedExternalCount = 0;

    for (const slot of allSlots) {
      if (slot.status === 'FREE') freeCount++;
      else if (slot.status === 'OCCUPIED') occupiedCount++;
      else if (slot.status === 'RENTED_EXTERNAL') rentedExternalCount++;
    }

    // 2. Active external rentals income
    const activeRentals = await this.rentalModel.findAll({
      where: rentalWhere,
      include: [
        { model: this.slotModel, as: 'slot', attributes: ['id', 'slotNumber', 'floorZone'], required: false },
        { model: this.projectModel, as: 'project', attributes: ['id', 'uuid', 'name'], required: false },
      ],
    });

    let totalReceivable = 0;
    let totalCollected = 0;

    for (const r of activeRentals) {
      totalReceivable += Number(r.monthlyRent || 0);
      totalCollected += Number(r.amountCollected || 0);
    }

    const totalDue = Math.max(0, totalReceivable - totalCollected);
    const collectionRate = totalReceivable > 0 ? Math.round((totalCollected / totalReceivable) * 100) : 0;
    const occupancyRate = totalSlots > 0 ? Math.round(((occupiedCount + rentedExternalCount) / totalSlots) * 100) : 0;

    const today = new Date();
    const monthName = today.toLocaleString('default', { month: 'long' });
    const year = today.getFullYear();

    return {
      project_id: projectId || null,
      month: monthName,
      year,
      total_slots: totalSlots,
      free_slots: freeCount,
      occupied_slots: occupiedCount,
      rented_external_slots: rentedExternalCount,
      occupancy_rate_percent: occupancyRate,
      active_external_rentals_count: activeRentals.length,
      monthly_rent_receivable: totalReceivable,
      monthly_rent_receivable_formatted: `৳ ${totalReceivable.toLocaleString('en-IN')}`,
      total_rent_collected: totalCollected,
      total_rent_collected_formatted: `৳ ${totalCollected.toLocaleString('en-IN')}`,
      total_rent_due: totalDue,
      total_rent_due_formatted: `৳ ${totalDue.toLocaleString('en-IN')}`,
      collection_rate_percent: collectionRate,
      rentals_breakdown: activeRentals.map(toSnakeCaseExternalRental),
    };
  }

  async getDropdownMeta(user: any, projectId?: string) {
    const orgWhere = this.buildOrgWhere(user);

    // Free slots available for allocation or external rental
    const freeSlotsWhere: any = { ...orgWhere, status: 'FREE' };
    if (projectId && projectId !== 'all') {
      freeSlotsWhere.projectId = projectId;
    }

    const freeSlots = await this.slotModel.findAll({
      where: freeSlotsWhere,
      attributes: ['id', 'uuid', 'slotNumber', 'floorZone', 'allowedVehicleType', 'projectId'],
      order: [['slotNumber', 'ASC']],
    });

    return {
      vehicle_types: ['Car', 'SUV', 'Motorcycle', 'Van / Micro', 'Any'],
      slot_statuses: ['FREE', 'OCCUPIED', 'RENTED_EXTERNAL'],
      rental_payment_statuses: ['PAID', 'PARTIAL', 'DUE', 'OVERDUE'],
      external_rental_statuses: ['ACTIVE', 'TERMINATED', 'EXPIRED'],
      floors_zones: [
        'Basement 1 (B1)',
        'Basement 2 (B2)',
        'Ground Floor (GF)',
        '1st Floor (1F)',
        'Outdoor Open Bay',
      ],
      free_slots: freeSlots.map((s) => ({
        id: s.id,
        uuid: s.uuid,
        slot_number: s.slotNumber,
        floor_zone: s.floorZone,
        allowed_vehicle_type: s.allowedVehicleType,
        project_id: s.projectId,
      })),
    };
  }
}

