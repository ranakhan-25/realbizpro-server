-- ======================================================
-- 1. Create ENUM types if they don't exist
-- ======================================================

DO $$ BEGIN
    CREATE TYPE challeng_destination_enum AS ENUM (
        'Branch_to_Receiving',
        'Receiving_to_Receiving',
        'Receiving_to_Godown',
        'Godown_to_Receiving',
        'Receiving_to_Finishing',
        'Receiving_to_Distribution'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE receiving_point_challan_type_enum AS ENUM (
        'Delivery',
        'Return',
        'Adjustment',
        'Transfer'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE challan_pack_status_enum AS ENUM (
        'PENDING',
        'PARTIAL',
        'COMPLETED'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE goods_type_enum AS ENUM (
        'SELLABLE',
        'NON_SELLABLE'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ======================================================
-- 2. Create table (using IF NOT EXISTS)
-- ======================================================
CREATE TABLE IF NOT EXISTS pos_receiving_point_challan (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,

    challan_number VARCHAR(200) NOT NULL,
    challan_date DATE NOT NULL,
    destination challeng_destination_enum,
    challan_type receiving_point_challan_type_enum NOT NULL,
    from_receiving_point_id INTEGER,
    to_receiving_point_id INTEGER,
    to_factory_id BIGINT,
    to_unit_id BIGINT,
    to_section_id INTEGER,
    to_distribution_id INTEGER,
    total_quantity INTEGER NOT NULL,
    uom_id INTEGER NOT NULL,
    packaging_status challan_pack_status_enum NOT NULL DEFAULT 'PENDING',
    ctn INTEGER,
    bag INTEGER,
    bundle INTEGER,
    bosta INTEGER,
    poly INTEGER,
    remarks TEXT,
    status_id BIGINT,
    reference VARCHAR(55),
    goods_type goods_type_enum NOT NULL DEFAULT 'SELLABLE',
    lc_number VARCHAR(100),
    invoice_number VARCHAR(100),
    received_at TIMESTAMP WITH TIME ZONE,
    dispatched_at TIMESTAMP WITH TIME ZONE,
    created_by INTEGER NOT NULL,
    updated_by INTEGER,
    deleted_by INTEGER,
    received_by INTEGER,
    dispatched_by INTEGER
);

-- ======================================================
-- 3. Foreign Keys (using IF NOT EXISTS for constraints)
-- ======================================================
-- (PostgreSQL doesn't have IF NOT EXISTS for FK, but we can check existence in DO blocks or just let it error – safe to run after table creation)

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_challan ADD CONSTRAINT fk_pos_receiving_point_challan_from_receiving_point
    FOREIGN KEY (from_receiving_point_id) REFERENCES pos_receiving_point(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_challan ADD CONSTRAINT fk_pos_receiving_point_challan_to_receiving_point
    FOREIGN KEY (to_receiving_point_id) REFERENCES pos_receiving_point(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_challan ADD CONSTRAINT fk_pos_receiving_point_challan_to_factory
    FOREIGN KEY (to_factory_id) REFERENCES prod_factory(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_challan ADD CONSTRAINT fk_pos_receiving_point_challan_to_unit
    FOREIGN KEY (to_unit_id) REFERENCES prod_unit(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_challan ADD CONSTRAINT fk_pos_receiving_point_challan_to_distribution
    FOREIGN KEY (to_distribution_id) REFERENCES pos_distribution(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_challan ADD CONSTRAINT fk_pos_receiving_point_challan_uom
    FOREIGN KEY (uom_id) REFERENCES sys_uom(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_challan ADD CONSTRAINT fk_pos_receiving_point_challan_status
    FOREIGN KEY (status_id) REFERENCES sys_delegation_statuses(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_challan ADD CONSTRAINT fk_pos_receiving_point_challan_created_by
    FOREIGN KEY (created_by) REFERENCES sys_users(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_challan ADD CONSTRAINT fk_pos_receiving_point_challan_updated_by
    FOREIGN KEY (updated_by) REFERENCES sys_users(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_challan ADD CONSTRAINT fk_pos_receiving_point_challan_deleted_by
    FOREIGN KEY (deleted_by) REFERENCES sys_users(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_challan ADD CONSTRAINT fk_pos_receiving_point_challan_received_by
    FOREIGN KEY (received_by) REFERENCES sys_users(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE pos_receiving_point_challan ADD CONSTRAINT fk_pos_receiving_point_challan_dispatched_by
    FOREIGN KEY (dispatched_by) REFERENCES sys_users(id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ======================================================
-- 4. Indexes (using IF NOT EXISTS)
-- ======================================================
CREATE INDEX IF NOT EXISTS idx_pos_receiving_point_challan_from_receiving_point
    ON pos_receiving_point_challan(from_receiving_point_id);

CREATE INDEX IF NOT EXISTS idx_pos_receiving_point_challan_to_receiving_point
    ON pos_receiving_point_challan(to_receiving_point_id);

CREATE INDEX IF NOT EXISTS idx_pos_receiving_point_challan_to_factory
    ON pos_receiving_point_challan(to_factory_id);

CREATE INDEX IF NOT EXISTS idx_pos_receiving_point_challan_to_unit
    ON pos_receiving_point_challan(to_unit_id);

CREATE INDEX IF NOT EXISTS idx_pos_receiving_point_challan_to_distribution
    ON pos_receiving_point_challan(to_distribution_id);

CREATE INDEX IF NOT EXISTS idx_pos_receiving_point_challan_uom
    ON pos_receiving_point_challan(uom_id);

CREATE INDEX IF NOT EXISTS idx_pos_receiving_point_challan_status
    ON pos_receiving_point_challan(status_id);

CREATE INDEX IF NOT EXISTS idx_pos_receiving_point_challan_created_by
    ON pos_receiving_point_challan(created_by);

CREATE INDEX IF NOT EXISTS idx_pos_receiving_point_challan_challan_number
    ON pos_receiving_point_challan(challan_number);

CREATE INDEX IF NOT EXISTS idx_pos_receiving_point_challan_challan_date
    ON pos_receiving_point_challan(challan_date);

CREATE INDEX IF NOT EXISTS idx_pos_receiving_point_challan_lc_number
    ON pos_receiving_point_challan(lc_number);

CREATE INDEX IF NOT EXISTS idx_pos_receiving_point_challan_invoice_number
    ON pos_receiving_point_challan(invoice_number);

CREATE INDEX IF NOT EXISTS idx_pos_receiving_point_challan_not_deleted
    ON pos_receiving_point_challan(id) WHERE deleted_at IS NULL;