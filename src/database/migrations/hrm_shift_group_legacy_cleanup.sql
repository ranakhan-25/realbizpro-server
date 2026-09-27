BEGIN;

-- 1) Move legacy group rows (hrm_shift_group -> hrm_shift_groups) by UUID
DO $$
BEGIN
  IF to_regclass('public.hrm_shift_group') IS NOT NULL
     AND to_regclass('public.hrm_shift_groups') IS NOT NULL THEN
    INSERT INTO public.hrm_shift_groups (
      uuid,
      office_id,
      effective_from,
      name,
      slug,
      group_types,
      description,
      status,
      created_by,
      updated_by,
      deleted_by,
      created_at,
      updated_at,
      deleted_at
    )
    SELECT
      legacy.uuid,
      legacy.office_id,
      legacy.effective_from,
      legacy.name,
      legacy.slug,
      legacy.group_types,
      legacy.description,
      legacy.status,
      legacy.created_by,
      legacy.updated_by,
      legacy.deleted_by,
      legacy.created_at,
      legacy.updated_at,
      legacy.deleted_at
    FROM public.hrm_shift_group legacy
    WHERE NOT EXISTS (
      SELECT 1
      FROM public.hrm_shift_groups target
      WHERE target.uuid = legacy.uuid
    );
  END IF;
END $$;

-- 2) Move legacy detail rows (hrm_shift_group_detail -> hrm_shift_groups_details)
--    Map old group id to new group id using group UUID
DO $$
BEGIN
  IF to_regclass('public.hrm_shift_group_detail') IS NOT NULL
     AND to_regclass('public.hrm_shift_group') IS NOT NULL
     AND to_regclass('public.hrm_shift_groups') IS NOT NULL
     AND to_regclass('public.hrm_shift_groups_details') IS NOT NULL THEN
    INSERT INTO public.hrm_shift_groups_details (
      uuid,
      hrm_shift_id,
      hrm_shifting_group_id,
      days_to_be_continued,
      sequence,
      created_by,
      updated_by,
      deleted_by,
      created_at,
      updated_at,
      deleted_at
    )
    SELECT
      legacy_detail.uuid,
      legacy_detail.hrm_shift_id,
      target_group.id AS hrm_shifting_group_id,
      legacy_detail.days_to_be_continued,
      legacy_detail.sequence,
      legacy_detail.created_by,
      legacy_detail.updated_by,
      legacy_detail.deleted_by,
      legacy_detail.created_at,
      legacy_detail.updated_at,
      legacy_detail.deleted_at
    FROM public.hrm_shift_group_detail legacy_detail
    INNER JOIN public.hrm_shift_group legacy_group
      ON legacy_group.id = legacy_detail.hrm_shifting_group_id
    INNER JOIN public.hrm_shift_groups target_group
      ON target_group.uuid = legacy_group.uuid
    WHERE NOT EXISTS (
      SELECT 1
      FROM public.hrm_shift_groups_details target_detail
      WHERE target_detail.uuid = legacy_detail.uuid
    );
  END IF;
END $$;

-- 3) Drop legacy singular tables so application uses only plural tables
DROP TABLE IF EXISTS public.hrm_shift_group_detail CASCADE;
DROP TABLE IF EXISTS public.hrm_shift_group CASCADE;

COMMIT;
