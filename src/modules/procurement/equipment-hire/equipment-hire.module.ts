import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProcurementHireOrder } from 'src/database/models/procurement/equipment-hire/pr_hire_order.model';
import { ProcurementHireOrderItem } from 'src/database/models/procurement/equipment-hire/pr_hire_order_item.model';
import { ProcurementHireIn } from 'src/database/models/procurement/equipment-hire/pr_hire_in.model';
import { ProcurementHireInItem } from 'src/database/models/procurement/equipment-hire/pr_hire_in_item.model';
import { ProcurementHireOut } from 'src/database/models/procurement/equipment-hire/pr_hire_out.model';
import { ProcurementHireOutItem } from 'src/database/models/procurement/equipment-hire/pr_hire_out_item.model';
import { ProcurementHireBill } from 'src/database/models/procurement/equipment-hire/pr_hire_bill.model';
import { ProcurementHireBillItem } from 'src/database/models/procurement/equipment-hire/pr_hire_bill_item.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { Site } from 'src/database/models/projects/project-site/pr_project_site.model';
import { SupplierAccounts } from 'src/database/models/projects/contract/pr_supplier_accounts.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { ProcurementAssetRequisition } from 'src/database/models/procurement/requisition/pr_asset_requisition.model';
import { ProcurementAssetRequisitionItem } from 'src/database/models/procurement/requisition/pr_asset_requisition_item.model';
import { ProcurementAssetItemEntry } from 'src/database/models/procurement/configuration/asset/pr_asset_item_entry.model';
import { ProcurementUnit } from 'src/database/models/procurement/configuration/products/pr_unit.model';
import { EquipmentHireService } from './equipment-hire.service';
import { EquipmentOnSiteController, HireBillController, HireInController, HireOrderController, HireOutController } from './equipment-hire.controller';
@Module({
  imports: [SequelizeModule.forFeature([ProcurementHireOrder, ProcurementHireOrderItem, ProcurementHireIn, ProcurementHireInItem, ProcurementHireOut, ProcurementHireOutItem, ProcurementHireBill, ProcurementHireBillItem, Project, Site, SupplierAccounts, SysUser, ProcurementAssetRequisition, ProcurementAssetRequisitionItem, ProcurementAssetItemEntry, ProcurementUnit])],
  controllers: [HireOrderController, HireInController, HireOutController, HireBillController, EquipmentOnSiteController],
  providers: [EquipmentHireService],
})
export class EquipmentHireModule {}
