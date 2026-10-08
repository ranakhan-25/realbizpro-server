ALTER TABLE pos_sale_payment
  ADD COLUMN IF NOT EXISTS settled_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_pos_sale_payment_settled_at
  ON pos_sale_payment(settled_at);

CREATE INDEX IF NOT EXISTS idx_pos_sale_payment_unsettled_card_mfs
  ON pos_sale_payment(payment_method, financial_account_id)
  WHERE deleted_at IS NULL
    AND settled_at IS NULL
    AND payment_method IN ('CARD', 'MFS');
