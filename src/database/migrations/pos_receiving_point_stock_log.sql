-- ======================================================
-- Safely create pgcrypto extension only if not exists
-- ======================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') THEN
        CREATE EXTENSION pgcrypto;
    END IF;
END;
$$;

-- ======================================================
-- 1. Create ENUM types safely
-- ======================================================

DO $$ BEGIN
    CREATE TYPE goods_type_enum AS ENUM ('SELLABLE', 'NON_SELLABLE', 'RAW');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE stock_log_type_enum AS ENUM ('STOCK_IN', 'STOCK_OUT');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE receiving_reference_type_enum AS ENUM (
        'LC_PURCHASE', 'LOCAL_PURCHASE', 'WAREHOUSE_CHALLAN', 'DISTRIBUTION_CHALLAN',
        'PRODUCTION_ORDER', 'STOCK_TRANSFER', 'STOCK_ADJUSTMENT', 'STOCK_AUDIT'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE receiving_transaction_type_enum AS ENUM (
        'CHALLAN_RECEIVE', 'CHALLAN_SEND', 'PURCHASE', 'PURCHASE_RETURN',
        'PRODUCTION_IN', 'PRODUCTION_OUT', 'DISTRIBUTION_TRANSFER', 'FINISHING_TRANSFER',
        'BRANCH_TRANSFER', 'GODOWN_TRANSFER', 'PHYSICAL_ADJUSTMENT', 'DAMAGE_ADJUSTMENT',
        'EXPIRY_ADJUSTMENT', 'INITIAL_STOCK', 'AUDIT_CORRECTION', 'SAMPLE'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ======================================================
-- 2. Create main table (IF NOT EXISTS)
-- ======================================================

CREATE TABLE IF NOT EXISTS pos_receiving_point_stock_log (
    id                          BIGSERIAL PRIMARY KEY,
    uuid                        UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    created_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at                  TIMESTAMP NULL,
    transaction_date            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    receiving_point_id          INTEGER NOT NULL,
    godown_id                   BIGINT NULL,

    category_id                 BIGINT NULL,
    product_id                  BIGINT NOT NULL,
    barcode                     VARCHAR(255) NULL,
    size_id                     BIGINT NULL,
    price_declaration_id        BIGINT NULL,

    lc_number                   VARCHAR(50) NULL,
    invoice_number              VARCHAR(50) NULL,

    goods_type                  goods_type_enum NOT NULL DEFAULT 'SELLABLE',
    opening_stock               DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock_in                    DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock_out                   DECIMAL(10,2) NOT NULL DEFAULT 0,
    closing_stock               DECIMAL(10,2) NOT NULL DEFAULT 0,

    reference_type              receiving_reference_type_enum NULL,
    reference_id                BIGINT NULL,
    notes                       TEXT NULL,
    log_type                    stock_log_type_enum NOT NULL DEFAULT 'STOCK_IN',
    transaction_type            receiving_transaction_type_enum NULL,

    challan_id                  BIGINT NULL,
    received_reciving_challan_id BIGINT NULL,
    warehouse_challan_id        BIGINT NULL,
    distribution_challan_id     BIGINT NULL,

    from_warehouse_id           INTEGER NULL,
    from_distribution_id        INTEGER NULL,
    from_godown_id              INTEGER NULL,
    from_factory_id             BIGINT NULL,
    from_unit_id                BIGINT NULL,
    from_section_id             BIGINT NULL,

    to_factory_id               BIGINT NULL,
    to_unit_id                  BIGINT NULL,
    to_section_id               BIGINT NULL,
    to_distribution_id          INTEGER NULL,
    to_godown_id                INTEGER NULL,

    created_by                  INTEGER NOT NULL,
    updated_by                  INTEGER NULL,
    deleted_by                  INTEGER NULL
);

-- ======================================================
-- 3. Add foreign keys (skip if already exist)
-- ======================================================

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_receiving_point
        FOREIGN KEY (receiving_point_id) REFERENCES pos_receiving_point(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_godown
        FOREIGN KEY (godown_id) REFERENCES pos_godown(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_category
        FOREIGN KEY (category_id) REFERENCES pos_category(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_product
        FOREIGN KEY (product_id) REFERENCES pos_products(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_size
        FOREIGN KEY (size_id) REFERENCES pos_sizes(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_price_declaration
        FOREIGN KEY (price_declaration_id) REFERENCES pos_price_declaration(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_challan
        FOREIGN KEY (challan_id) REFERENCES pos_receiving_point_challan(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_received_challan
        FOREIGN KEY (received_reciving_challan_id) REFERENCES pos_receiving_point_challan(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_warehouse_challan
        FOREIGN KEY (warehouse_challan_id) REFERENCES pos_warehouse_challan(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_distribution_challan
        FOREIGN KEY (distribution_challan_id) REFERENCES pos_distribution_challan(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_from_warehouse
        FOREIGN KEY (from_warehouse_id) REFERENCES pos_warehouse(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_from_distribution
        FOREIGN KEY (from_distribution_id) REFERENCES pos_distribution(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_from_godown
        FOREIGN KEY (from_godown_id) REFERENCES pos_godown(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_from_factory
        FOREIGN KEY (from_factory_id) REFERENCES prod_factory(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_from_unit
        FOREIGN KEY (from_unit_id) REFERENCES  prod_unit(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_from_section
        FOREIGN KEY (from_section_id) REFERENCES prod_section(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_to_factory
        FOREIGN KEY (to_factory_id) REFERENCES prod_factory(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_to_unit
        FOREIGN KEY (to_unit_id) REFERENCES  prod_unit(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_to_section
        FOREIGN KEY (to_section_id) REFERENCES prod_section(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_to_distribution
        FOREIGN KEY (to_distribution_id) REFERENCES pos_distribution(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_stock_log ADD CONSTRAINT fk_rp_stock_log_to_godown
        FOREIGN KEY (to_godown_id) REFERENCES pos_godown(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ======================================================
-- 4. Create indexes (safe)
-- ======================================================

CREATE INDEX IF NOT EXISTS idx_pos_rp_stock_log_latest
    ON pos_receiving_point_stock_log (receiving_point_id, product_id, size_id, barcode, transaction_date DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_pos_rp_stock_log_lookup
    ON pos_receiving_point_stock_log (receiving_point_id, product_id, size_id, goods_type, price_declaration_id, transaction_date DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_pos_rp_stock_log_reference
    ON pos_receiving_point_stock_log (reference_type, reference_id);

-- ======================================================
-- 5. Auto-update updated_at trigger (safe)
-- ======================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_pos_receiving_point_stock_log_updated_at
    ON pos_receiving_point_stock_log;

CREATE TRIGGER trigger_update_pos_receiving_point_stock_log_updated_at
    BEFORE UPDATE ON pos_receiving_point_stock_log
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();