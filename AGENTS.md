# Project Directives & Media Upload Rules

## File & Media Upload Protocol (S3/MinIO & Local Fallback)
- **Primary Upload Endpoint**: `POST /realbizpro/api/v1/files/upload` (`multipart/form-data`) with `JwtAuthGuard`.
- **Controller & Service**:
  - Controller: `src/modules/engine/s3minio/s3minio.controller.ts` (`@Controller('files')`)
  - Service: `src/modules/engine/s3minio/s3minio.service.ts`
  - Model: `src/database/models/system/sys_file.model.ts` (`SysFileModel`, table `sys_files`)
- **Parameters**:
  - `file`: Binary file upload
  - `pathFolder` (optional, string): Target subfolder path within the bucket (e.g. `crm/leads`, `projects/agreements`, `organizations/logos`, `avatars`).
  - `fileName` (optional, string): Custom semantic base name without timestamp/random hash.
- **Key Construction**:
  - Service generates: `${folder ? `${folder}/` : ''}${sanitizedCustomName}-${timestamp}-${randomString}.${fileExtension}`
  - Saves file key to `sys_files.file_path`.
- **Direct Content Streaming**:
  - `GET /realbizpro/api/v1/files/content/{key}` (`@Public()`) streams file content directly to clients.
- **Deletion**:
  - `DELETE /realbizpro/api/v1/files/{key}` removes from S3/MinIO and marks in DB.

## Documentation and Specifications Protocol
- **Primary Project Location**: All architecture plans, specifications, module audits, and markdown documentation must always be saved directly inside the project repository within the `docs/` folder (for example, `docs/enterprise_architecture_plan_lams_inventory.md`).
- Never save project plans, guides, or specifications outside the repository workspace.
