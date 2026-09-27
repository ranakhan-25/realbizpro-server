ALTER TABLE pos_operation_summary
  ADD COLUMN IF NOT EXISTS settlement_amounts JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS is_settled BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS settled_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS settled_by BIGINT,
  ADD COLUMN IF NOT EXISTS cash_denomination JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS cash_denomination_total NUMERIC(18, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_day_closed BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS day_closed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS day_closed_by BIGINT,
  ADD COLUMN IF NOT EXISTS day_closing_remarks TEXT;

DO $$ BEGIN
    ALTER TABLE pos_operation_summary
      ADD CONSTRAINT fk_pos_operation_summary_settled_by
      FOREIGN KEY (settled_by) REFERENCES sys_users(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_operation_summary
      ADD CONSTRAINT fk_pos_operation_summary_day_closed_by
      FOREIGN KEY (day_closed_by) REFERENCES sys_users(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_pos_operation_summary_is_settled
  ON pos_operation_summary(is_settled);

CREATE INDEX IF NOT EXISTS idx_pos_operation_summary_is_day_closed
  ON pos_operation_summary(is_day_closed);
