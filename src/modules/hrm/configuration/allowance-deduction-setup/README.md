# Allowance Deduction Setup module

Copy this folder into your NestJS module directory, for example `src/hrm/configuration/allowance-deduction-setup/`.

Files included:
- `dto/create-allowance-deduction-setup.dto.ts`
- `dto/query-allowance-deduction-setup.dto.ts`
- `dto/update-allowance-deduction-setup.dto.ts`
- `allowance-deduction-setup.controller.ts`
- `allowance-deduction-setup.service.ts`
- `allowance-deduction-setup.module.ts`

The model import path currently assumes:
`src/database/models/hrm/configuration/allowance_deduction_setup_model`

If your model is stored under a different filename/path, update the imports in the DTOs, service, and module. Register `AllowanceDeductionSetupModule` in the appropriate parent module.
