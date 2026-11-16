'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const sequelize = queryInterface.sequelize;

    await sequelize.transaction(async (t) => {
      await sequelize.query(`
        DO $$
        DECLARE
          v_table_max BIGINT;
          v_seq_last BIGINT;
          v_is_called BOOLEAN;
          v_seq_next BIGINT;
          v_table_next BIGINT;
          v_target_next BIGINT;
          v_seq_exists BOOLEAN;
        BEGIN
          -- =========================================================================
          -- 1. CUSTOMER DOCUMENTS (DOC-201+)
          -- =========================================================================
          SELECT EXISTS (
            SELECT 1 FROM pg_sequences 
            WHERE schemaname = 'public' AND sequencename = 'cs_customer_documents_code_seq'
          ) INTO v_seq_exists;

          IF NOT v_seq_exists THEN
            CREATE SEQUENCE public.cs_customer_documents_code_seq START WITH 201;
            v_seq_next := 201;
          ELSE
            SELECT last_value, is_called 
            INTO v_seq_last, v_is_called 
            FROM public.cs_customer_documents_code_seq;

            IF v_is_called THEN
              v_seq_next := v_seq_last + 1;
            ELSE
              v_seq_next := v_seq_last;
            END IF;
          END IF;

          -- Include soft-deleted rows by scanning all rows without deleted_at filter
          SELECT MAX(
            CASE 
              WHEN doc_code ~ '^DOC-[0-9]+$' 
              THEN (substring(doc_code from '^DOC-([0-9]+)$'))::bigint 
              ELSE NULL 
            END
          ) INTO v_table_max FROM public.cs_customer_documents;

          IF v_table_max IS NOT NULL THEN
            v_table_next := v_table_max + 1;
          ELSE
            v_table_next := 201;
          END IF;

          v_target_next := GREATEST(201, v_table_next, COALESCE(v_seq_next, 201));
          PERFORM setval('public.cs_customer_documents_code_seq', v_target_next, false);

          -- =========================================================================
          -- 2. REGISTRATION TRACKING (REG-801+)
          -- =========================================================================
          SELECT EXISTS (
            SELECT 1 FROM pg_sequences 
            WHERE schemaname = 'public' AND sequencename = 'cs_registration_trackings_code_seq'
          ) INTO v_seq_exists;

          IF NOT v_seq_exists THEN
            CREATE SEQUENCE public.cs_registration_trackings_code_seq START WITH 801;
            v_seq_next := 801;
          ELSE
            SELECT last_value, is_called 
            INTO v_seq_last, v_is_called 
            FROM public.cs_registration_trackings_code_seq;

            IF v_is_called THEN
              v_seq_next := v_seq_last + 1;
            ELSE
              v_seq_next := v_seq_last;
            END IF;
          END IF;

          SELECT MAX(
            CASE 
              WHEN reg_code ~ '^REG-[0-9]+$' 
              THEN (substring(reg_code from '^REG-([0-9]+)$'))::bigint 
              ELSE NULL 
            END
          ) INTO v_table_max FROM public.cs_registration_trackings;

          IF v_table_max IS NOT NULL THEN
            v_table_next := v_table_max + 1;
          ELSE
            v_table_next := 801;
          END IF;

          v_target_next := GREATEST(801, v_table_next, COALESCE(v_seq_next, 801));
          PERFORM setval('public.cs_registration_trackings_code_seq', v_target_next, false);

          -- =========================================================================
          -- 3. MUTATION TRACKING (MUT-701+)
          -- =========================================================================
          SELECT EXISTS (
            SELECT 1 FROM pg_sequences 
            WHERE schemaname = 'public' AND sequencename = 'cs_mutation_trackings_code_seq'
          ) INTO v_seq_exists;

          IF NOT v_seq_exists THEN
            CREATE SEQUENCE public.cs_mutation_trackings_code_seq START WITH 701;
            v_seq_next := 701;
          ELSE
            SELECT last_value, is_called 
            INTO v_seq_last, v_is_called 
            FROM public.cs_mutation_trackings_code_seq;

            IF v_is_called THEN
              v_seq_next := v_seq_last + 1;
            ELSE
              v_seq_next := v_seq_last;
            END IF;
          END IF;

          SELECT MAX(
            CASE 
              WHEN mut_code ~ '^MUT-[0-9]+$' 
              THEN (substring(mut_code from '^MUT-([0-9]+)$'))::bigint 
              ELSE NULL 
            END
          ) INTO v_table_max FROM public.cs_mutation_trackings;

          IF v_table_max IS NOT NULL THEN
            v_table_next := v_table_max + 1;
          ELSE
            v_table_next := 701;
          END IF;

          v_target_next := GREATEST(701, v_table_next, COALESCE(v_seq_next, 701));
          PERFORM setval('public.cs_mutation_trackings_code_seq', v_target_next, false);

          -- =========================================================================
          -- 4. PERMISSIONS (OWNER ONLY - ZERO PUBLIC GRANTS)
          -- =========================================================================
          GRANT USAGE, SELECT ON SEQUENCE public.cs_customer_documents_code_seq TO CURRENT_USER;
          GRANT USAGE, SELECT ON SEQUENCE public.cs_registration_trackings_code_seq TO CURRENT_USER;
          GRANT USAGE, SELECT ON SEQUENCE public.cs_mutation_trackings_code_seq TO CURRENT_USER;
        END $$;
      `, { transaction: t });
    });
  },

  async down(queryInterface) {
    const sequelize = queryInterface.sequelize;
    // Intentionally non-destructive down():
    // Sequences are permanently preserved to protect allocation history and prevent duplicate code reuse.
    await sequelize.query(`
      DO $$
      BEGIN
        RAISE NOTICE 'Customer Service sequences (public.cs_*_code_seq) are intentionally preserved to protect allocation history.';
      END $$;
    `);
  },
};
