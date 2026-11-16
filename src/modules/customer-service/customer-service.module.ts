import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CsCustomerProfile } from 'src/database/models/customer-service/cs_customer_profile.model';
import { CsBookingHandover } from 'src/database/models/customer-service/cs_booking_handover.model';
import { CsChangeRequest } from 'src/database/models/customer-service/cs_change_request.model';
import { CsUtilityTechnician } from 'src/database/models/customer-service/cs_utility_technician.model';
import { CsWarrantyItem } from 'src/database/models/customer-service/cs_warranty_item.model';
import { CsUtilityTicket } from 'src/database/models/customer-service/cs_utility_ticket.model';
import { CsSecurityCompany } from 'src/database/models/customer-service/cs_security_company.model';
import { CsSecurityGuard } from 'src/database/models/customer-service/cs_security_guard.model';
import { CsSecurityRoster } from 'src/database/models/customer-service/cs_security_roster.model';
import { CsSecurityVisitorLog } from 'src/database/models/customer-service/cs_security_visitor_log.model';
import { CsParkingSlot } from 'src/database/models/customer-service/cs_parking_slot.model';
import { CsParkingAssignment } from 'src/database/models/customer-service/cs_parking_assignment.model';
import { CsParkingExternalRental } from 'src/database/models/customer-service/cs_parking_external_rental.model';
import { CsServiceChargeRate } from 'src/database/models/customer-service/cs_service_charge_rate.model';
import { CsFlatServiceCharge } from 'src/database/models/customer-service/cs_flat_service_charge.model';
import { CsBuildingIncome } from 'src/database/models/customer-service/cs_building_income.model';
import { CsBuildingExpense } from 'src/database/models/customer-service/cs_building_expense.model';
import { CsCommitteeMember } from 'src/database/models/customer-service/cs_committee_member.model';
import { CsCommitteeDecision } from 'src/database/models/customer-service/cs_committee_decision.model';
import { CsCustomerDocument } from 'src/database/models/customer-service/cs_customer_document.model';
import { CsRegistrationTracking } from 'src/database/models/customer-service/cs_registration_tracking.model';
import { CsMutationTracking } from 'src/database/models/customer-service/cs_mutation_tracking.model';
import { CsHandoverSnag } from 'src/database/models/customer-service/cs_handover_snag.model';
import { CsServiceTicket } from 'src/database/models/customer-service/cs_service_ticket.model';
import { CsWarrantyDlpClaim } from 'src/database/models/customer-service/cs_warranty_dlp_claim.model';
import { CsMaintenanceRequest } from 'src/database/models/customer-service/cs_maintenance_request.model';
import { CsOwnersAssociation } from 'src/database/models/customer-service/cs_owners_association.model';
import { CsServiceWorkflowRule } from 'src/database/models/customer-service/cs_service_workflow_rule.model';
import { FlatLandBooking } from 'src/database/models/projects/flat-land-booking/pr_flat_land_booking.model';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';
import { CrSaleAgreement } from 'src/database/models/credit-realization/cr_sale_agreement.model';
import { CrInstallmentPlan } from 'src/database/models/credit-realization/cr_installment_plan.model';
import { CrInstallmentPayment } from 'src/database/models/credit-realization/cr_installment_payment.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { SysNotification } from 'src/database/models/system/sys_notification.model';
import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { CustomerServiceTenantGuard } from './common/customer-service-tenant.guard';
import { CustomerServiceController } from './customer-service.controller';
import { CustomerServiceService } from './customer-service.service';
import { CustomerServiceBookingsController } from './bookings/customer-service-bookings.controller';
import { CustomerServiceBookingsService } from './bookings/customer-service-bookings.service';
import { CustomerServiceChangeRequestsController } from './change-requests/customer-service-change-requests.controller';
import { CustomerServiceChangeRequestsService } from './change-requests/customer-service-change-requests.service';
import { CustomerServiceUtilityController } from './utility-service/customer-service-utility.controller';
import { CustomerServiceUtilityService } from './utility-service/customer-service-utility.service';
import { CustomerServiceSecurityController } from './security-service/customer-service-security.controller';
import { CustomerServiceSecurityService } from './security-service/customer-service-security.service';
import { CustomerServiceParkingController } from './parking-service/customer-service-parking.controller';
import { CustomerServiceParkingService } from './parking-service/customer-service-parking.service';
import { CustomerServiceChargeController } from './service-charge/customer-service-charge.controller';
import { CustomerServiceChargeService } from './service-charge/customer-service-charge.service';
import { CustomerServiceCommitteeController } from './building-committee/customer-service-committee.controller';
import { CustomerServiceCommitteeService } from './building-committee/customer-service-committee.service';
import { CustomerServiceDocumentsController } from './documents/customer-service-documents.controller';
import { CustomerServiceDocumentsService } from './documents/customer-service-documents.service';
import { CustomerServiceHandoverController } from './handover/customer-service-handover.controller';
import { CustomerServiceHandoverService } from './handover/customer-service-handover.service';
import { CustomerServiceTicketsController } from './tickets/customer-service-tickets.controller';
import { CustomerServiceTicketsService } from './tickets/customer-service-tickets.service';
import { CustomerServicePropertyCareController } from './property-care/customer-service-property-care.controller';
import { CustomerServicePropertyCareService } from './property-care/customer-service-property-care.service';
import { CustomerServiceSettingsController } from './settings/customer-service-settings.controller';
import { CustomerServiceSettingsService } from './settings/customer-service-settings.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CsCustomerProfile,
      CsBookingHandover,
      CsChangeRequest,
      CsUtilityTechnician,
      CsWarrantyItem,
      CsUtilityTicket,
      CsSecurityCompany,
      CsSecurityGuard,
      CsSecurityRoster,
      CsSecurityVisitorLog,
      CsParkingSlot,
      CsParkingAssignment,
      CsParkingExternalRental,
      CsServiceChargeRate,
      CsFlatServiceCharge,
      CsBuildingIncome,
      CsBuildingExpense,
      CsCommitteeMember,
      CsCommitteeDecision,
      CsCustomerDocument,
      CsRegistrationTracking,
      CsMutationTracking,
      CsHandoverSnag,
      CsServiceTicket,
      CsWarrantyDlpClaim,
      CsMaintenanceRequest,
      CsOwnersAssociation,
      CsServiceWorkflowRule,
      FlatLandBooking,
      FlatLand,
      CrSaleAgreement,
      CrInstallmentPlan,
      CrInstallmentPayment,
      Project,
      SysNotification,
      SysOrganization,
    ]),
  ],
  controllers: [
    CustomerServiceController,
    CustomerServiceBookingsController,
    CustomerServiceChangeRequestsController,
    CustomerServiceUtilityController,
    CustomerServiceSecurityController,
    CustomerServiceParkingController,
    CustomerServiceChargeController,
    CustomerServiceCommitteeController,
    CustomerServiceDocumentsController,
    CustomerServiceHandoverController,
    CustomerServiceTicketsController,
    CustomerServicePropertyCareController,
    CustomerServiceSettingsController,
  ],
  providers: [
    CustomerServiceTenantGuard,
    CustomerServiceService,
    CustomerServiceBookingsService,
    CustomerServiceChangeRequestsService,
    CustomerServiceUtilityService,
    CustomerServiceSecurityService,
    CustomerServiceParkingService,
    CustomerServiceChargeService,
    CustomerServiceCommitteeService,
    CustomerServiceDocumentsService,
    CustomerServiceHandoverService,
    CustomerServiceTicketsService,
    CustomerServicePropertyCareService,
    CustomerServiceSettingsService,
  ],
  exports: [
    CustomerServiceTenantGuard,
    CustomerServiceService,
    CustomerServiceBookingsService,
    CustomerServiceChangeRequestsService,
    CustomerServiceUtilityService,
    CustomerServiceSecurityService,
    CustomerServiceParkingService,
    CustomerServiceChargeService,
    CustomerServiceCommitteeService,
    CustomerServiceDocumentsService,
    CustomerServiceHandoverService,
    CustomerServiceTicketsService,
    CustomerServicePropertyCareService,
    CustomerServiceSettingsService,
  ],
})
export class CustomerServiceModule {}
