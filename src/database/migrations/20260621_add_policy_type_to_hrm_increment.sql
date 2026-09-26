-- ======================================================
-- Policy type support for increment / promotion
-- ======================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'policy_type_enum'
  ) THEN
    CREATE TYPE policy_type_enum AS ENUM ('INCREMENT', 'PROMOTION');
  END IF;
END $$;

ALTER TABLE hrm_increment_policy
  ADD COLUMN IF NOT EXISTS policy_type policy_type_enum NOT NULL DEFAULT 'INCREMENT';

UPDATE hrm_increment_policy
SET policy_type = 'INCREMENT'
WHERE policy_type IS NULL;

ALTER TABLE hrm_increment_employeemap
  ADD COLUMN IF NOT EXISTS from_designation_id BIGINT NULL,
  ADD COLUMN IF NOT EXISTS to_designation_id BIGINT NULL,
  ADD COLUMN IF NOT EXISTS from_department_id BIGINT NULL,
  ADD COLUMN IF NOT EXISTS to_department_id BIGINT NULL,
  ADD COLUMN IF NOT EXISTS from_grade_id BIGINT NULL,
  ADD COLUMN IF NOT EXISTS to_grade_id BIGINT NULL,
  ADD COLUMN IF NOT EXISTS promotion_effective_date DATE NULL;

ALTER TABLE hrm_increment_execution
  ADD COLUMN IF NOT EXISTS old_designation_id BIGINT NULL,
  ADD COLUMN IF NOT EXISTS new_designation_id BIGINT NULL,
  ADD COLUMN IF NOT EXISTS old_department_id BIGINT NULL,
  ADD COLUMN IF NOT EXISTS new_department_id BIGINT NULL,
  ADD COLUMN IF NOT EXISTS old_grade_id BIGINT NULL,
  ADD COLUMN IF NOT EXISTS new_grade_id BIGINT NULL;

CREATE INDEX IF NOT EXISTS idx_hrm_increment_policy_policy_type
  ON hrm_increment_policy (policy_type);

CREATE INDEX IF NOT EXISTS idx_hrm_increment_policy_policy_type_reference_no
  ON hrm_increment_policy (policy_type, reference_no);
