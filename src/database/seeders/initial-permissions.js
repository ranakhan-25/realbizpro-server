'use strict';

const {
  intelligentUpsert,
} = require('../seeder.helper');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // First get all features with their modules
    const [features] =
      await queryInterface.sequelize.query(
        'SELECT id, name FROM sys_features',
      );

    const permissionsData = [
      {
        uuid: uuidv4(),
        key: 'create_showroom',
        name: 'Create Showroom',
        resource: 'showroom',
        action: 'create',
        context: 'any',
        description: 'Create a new showroom',
        feature_id:
          features.find(
            (f) => f.name === 'Showrooms',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_showrooms',
        name: 'View Showrooms',
        resource: 'showroom',
        action: 'read',
        context: 'any',
        description:
          'Get all showrooms (paginated & filtered)',
        feature_id:
          features.find(
            (f) => f.name === 'Showrooms',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_showroom',
        name: 'View Showroom',
        resource: 'showroom',
        action: 'read',
        context: 'any',
        description: 'Get showroom by ID',
        feature_id:
          features.find(
            (f) => f.name === 'Showrooms',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_showroom',
        name: 'Update Showroom',
        resource: 'showroom',
        action: 'update',
        context: 'any',
        description: 'Update showroom',
        feature_id:
          features.find(
            (f) => f.name === 'Showrooms',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_showroom',
        name: 'Delete Showroom',
        resource: 'showroom',
        action: 'delete',
        context: 'any',
        description: 'Soft delete showroom',
        feature_id:
          features.find(
            (f) => f.name === 'Showrooms',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_showroom',
        name: 'Restore Showroom',
        resource: 'showroom',
        action: 'update',
        context: 'any',
        description:
          'Restore soft-deleted showroom',
        feature_id:
          features.find(
            (f) => f.name === 'Showrooms',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_vehicle',
        name: 'Create Vehicle',
        resource: 'vehicle',
        action: 'create',
        context: 'any',
        description: 'Create a new vehicle',
        feature_id:
          features.find(
            (f) => f.name === 'Vehicle',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'list_vehicle',
        name: 'List Vehicle',
        resource: 'vehicle',
        action: 'list',
        context: 'any',
        description:
          'Get all vehicles (paginated & filtered)',
        feature_id:
          features.find(
            (f) => f.name === 'Vehicle',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'read_vehicle',
        name: 'Read Vehicle',
        resource: 'vehicle',
        action: 'read',
        context: 'any',
        description: 'Get a vehicle by UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Vehicle',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_vehicle',
        name: 'Update Vehicle',
        resource: 'vehicle',
        action: 'update',
        context: 'any',
        description: 'Update a vehicle by UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Vehicle',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_vehicle',
        name: 'Delete Vehicle',
        resource: 'vehicle',
        action: 'delete',
        context: 'any',
        description:
          'Soft delete a vehicle by UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Vehicle',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'force_delete_vehicle',
        name: 'Force Delete Vehicle',
        resource: 'vehicle',
        action: 'delete',
        context: 'any',
        description:
          'Hard delete (permanent) vehicle — requires soft-delete first',
        feature_id:
          features.find(
            (f) => f.name === 'Vehicle',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_vehicle',
        name: 'Restore Vehicle',
        resource: 'vehicle',
        action: 'update',
        context: 'any',
        description:
          'Restore a soft-deleted vehicle by UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Vehicle',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_uom',
        name: 'Create Uom',
        resource: 'uom',
        action: 'create',
        context: 'any',
        description: 'Create a new UOM',
        feature_id:
          features.find((f) => f.name === 'UOM')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'list_uom',
        name: 'List Uom',
        resource: 'uom',
        action: 'list',
        context: 'any',
        description:
          'Get all UOMs (paginated & filtered)',
        feature_id:
          features.find((f) => f.name === 'UOM')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'read_uom',
        name: 'Read Uom',
        resource: 'uom',
        action: 'read',
        context: 'any',
        description: 'Get a UOM by UUID',
        feature_id:
          features.find((f) => f.name === 'UOM')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_uom',
        name: 'Update Uom',
        resource: 'uom',
        action: 'update',
        context: 'any',
        description: 'Update a UOM by UUID',
        feature_id:
          features.find((f) => f.name === 'UOM')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_uom',
        name: 'Delete Uom',
        resource: 'uom',
        action: 'delete',
        context: 'any',
        description: 'Soft delete a UOM by UUID',
        feature_id:
          features.find((f) => f.name === 'UOM')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'force_delete_uom',
        name: 'Force Delete Uom',
        resource: 'uom',
        action: 'delete',
        context: 'any',
        description:
          'Hard delete (permanent) UOM — requires soft-delete first',
        feature_id:
          features.find((f) => f.name === 'UOM')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_uom',
        name: 'Restore Uom',
        resource: 'uom',
        action: 'update',
        context: 'any',
        description:
          'Restore a soft-deleted UOM by UUID',
        feature_id:
          features.find((f) => f.name === 'UOM')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_office_type',
        name: 'Create Office Type',
        resource: 'officetype',
        action: 'create',
        context: 'any',
        description: 'Create office type',
        feature_id:
          features.find(
            (f) => f.name === 'Office Type',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'list_office_type',
        name: 'List Office Type',
        resource: 'officetype',
        action: 'list',
        context: 'any',
        description: 'List office types',
        feature_id:
          features.find(
            (f) => f.name === 'Office Type',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'read_office_type',
        name: 'Read Office Type',
        resource: 'officetype',
        action: 'read',
        context: 'any',
        description: 'Get single office type',
        feature_id:
          features.find(
            (f) => f.name === 'Office Type',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_office_type',
        name: 'Update Office Type',
        resource: 'officetype',
        action: 'update',
        context: 'any',
        description: 'Update office type',
        feature_id:
          features.find(
            (f) => f.name === 'Office Type',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_office_type',
        name: 'Delete Office Type',
        resource: 'officetype',
        action: 'delete',
        context: 'any',
        description: 'Delete office type',
        feature_id:
          features.find(
            (f) => f.name === 'Office Type',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_office',
        name: 'Create Office',
        resource: 'office',
        action: 'create',
        context: 'any',
        description: 'Create a new office',
        feature_id:
          features.find(
            (f) => f.name === 'Office',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'list_office',
        name: 'List Office',
        resource: 'office',
        action: 'list',
        context: 'any',
        description: 'Get office list',
        feature_id:
          features.find(
            (f) => f.name === 'Office',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'read_office',
        name: 'Read Office',
        resource: 'office',
        action: 'read',
        context: 'any',
        description: 'Get office by UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Office',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_office',
        name: 'Update Office',
        resource: 'office',
        action: 'update',
        context: 'any',
        description: 'Update office by UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Office',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_office',
        name: 'Delete Office',
        resource: 'office',
        action: 'delete',
        context: 'any',
        description: 'Delete office by UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Office',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_floor',
        name: 'Create Floor',
        resource: 'floor',
        action: 'create',
        context: 'any',
        description: 'Create floor',
        feature_id:
          features.find((f) => f.name === 'Floor')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'list_floor',
        name: 'List Floor',
        resource: 'floor',
        action: 'list',
        context: 'any',
        description: 'List floors',
        feature_id:
          features.find((f) => f.name === 'Floor')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'read_floor',
        name: 'Read Floor',
        resource: 'floor',
        action: 'read',
        context: 'any',
        description:
          'Allows read action on any floor resource.',
        feature_id:
          features.find((f) => f.name === 'Floor')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_floor',
        name: 'Update Floor',
        resource: 'floor',
        action: 'update',
        context: 'any',
        description:
          'Allows update action on any floor resource.',
        feature_id:
          features.find((f) => f.name === 'Floor')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_floor',
        name: 'Delete Floor',
        resource: 'floor',
        action: 'delete',
        context: 'any',
        description:
          'Allows delete action on any floor resource.',
        feature_id:
          features.find((f) => f.name === 'Floor')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_factory_unit',
        name: 'Create Factory Unit',
        resource: 'factoryunit',
        action: 'create',
        context: 'any',
        description: 'Create a new factory unit',
        feature_id:
          features.find(
            (f) => f.name === 'Factory Units',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_factory_units',
        name: 'View Factory Units',
        resource: 'factoryunit',
        action: 'read',
        context: 'any',
        description:
          'Get factory units (with pagination & search)',
        feature_id:
          features.find(
            (f) => f.name === 'Factory Units',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_factory_unit',
        name: 'View Factory Unit',
        resource: 'factoryunit',
        action: 'read',
        context: 'any',
        description:
          'Get single factory unit by ID',
        feature_id:
          features.find(
            (f) => f.name === 'Factory Units',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_factory_unit',
        name: 'Update Factory Unit',
        resource: 'factoryunit',
        action: 'update',
        context: 'any',
        description: 'Update factory unit by ID',
        feature_id:
          features.find(
            (f) => f.name === 'Factory Units',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_factory_unit',
        name: 'Delete Factory Unit',
        resource: 'factoryunit',
        action: 'delete',
        context: 'any',
        description:
          'Soft delete factory unit by ID',
        feature_id:
          features.find(
            (f) => f.name === 'Factory Units',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_section',
        name: 'Create Section',
        resource: 'section',
        action: 'create',
        context: 'any',
        description: 'Create a new section',
        feature_id:
          features.find(
            (f) => f.name === 'Factory Sections',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_sections',
        name: 'View Sections',
        resource: 'section',
        action: 'read',
        context: 'any',
        description:
          'List all sections with optional pagination',
        feature_id:
          features.find(
            (f) => f.name === 'Factory Sections',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_section',
        name: 'View Section',
        resource: 'section',
        action: 'read',
        context: 'any',
        description:
          'Get a section by numeric ID or UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Factory Sections',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_section',
        name: 'Update Section',
        resource: 'section',
        action: 'update',
        context: 'any',
        description:
          'Update a section by numeric ID or UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Factory Sections',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_section',
        name: 'Delete Section',
        resource: 'section',
        action: 'delete',
        context: 'any',
        description:
          'Soft delete a section by numeric ID or UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Factory Sections',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_factory',
        name: 'Create Factory',
        resource: 'factory',
        action: 'create',
        context: 'any',
        description: 'Create a new factory',
        feature_id:
          features.find(
            (f) => f.name === 'Factories',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_factories',
        name: 'View Factories',
        resource: 'factory',
        action: 'read',
        context: 'any',
        description:
          'Get factories with optional pagination',
        feature_id:
          features.find(
            (f) => f.name === 'Factories',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_factory',
        name: 'View Factory',
        resource: 'factory',
        action: 'read',
        context: 'any',
        description:
          'Get factory by numeric ID or UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Factories',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_factory',
        name: 'Update Factory',
        resource: 'factory',
        action: 'update',
        context: 'any',
        description:
          'Update factory by numeric ID or UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Factories',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_factory',
        name: 'Delete Factory',
        resource: 'factory',
        action: 'delete',
        context: 'any',
        description:
          'Soft delete factory by numeric ID or UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Factories',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_factory_gate',
        name: 'Create Factory Gate',
        resource: 'factorygate',
        action: 'create',
        context: 'any',
        description: 'Create a gate for a factory',
        feature_id:
          features.find(
            (f) => f.name === 'Factory Gates',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_factory_gates',
        name: 'View Factory Gates',
        resource: 'factorygate',
        action: 'read',
        context: 'any',
        description:
          'Get gates of a factory with pagination & search',
        feature_id:
          features.find(
            (f) => f.name === 'Factory Gates',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_factory_gate',
        name: 'View Factory Gate',
        resource: 'factorygate',
        action: 'read',
        context: 'any',
        description:
          'Get a single factory gate by ID or UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Factory Gates',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_factory_gate',
        name: 'Update Factory Gate',
        resource: 'factorygate',
        action: 'update',
        context: 'any',
        description:
          'Update a factory gate by ID or UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Factory Gates',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_factory_gate',
        name: 'Delete Factory Gate',
        resource: 'factorygate',
        action: 'delete',
        context: 'any',
        description:
          'Soft delete a factory gate by ID or UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Factory Gates',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_divisions',
        name: 'View Divisions',
        resource: 'division',
        action: 'read',
        context: 'any',
        description:
          'Get divisions with district, upazila & union (ID / Name filters)',
        feature_id:
          features.find(
            (f) => f.name === 'Division',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_division',
        name: 'View Division',
        resource: 'division',
        action: 'read',
        context: 'any',
        description:
          'Get single division by UUID with districts, upazilas & unions',
        feature_id:
          features.find(
            (f) => f.name === 'Division',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_company',
        name: 'Create Company',
        resource: 'company',
        action: 'create',
        context: 'any',
        description: 'Create a new company',
        feature_id:
          features.find(
            (f) => f.name === 'Companies',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_companies',
        name: 'View Companies',
        resource: 'company',
        action: 'read',
        context: 'any',
        description:
          'Get all companies with optional pagination',
        feature_id:
          features.find(
            (f) => f.name === 'Companies',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_company',
        name: 'View Company',
        resource: 'company',
        action: 'read',
        context: 'any',
        description: 'Get company by ID',
        feature_id:
          features.find(
            (f) => f.name === 'Companies',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_company',
        name: 'Update Company',
        resource: 'company',
        action: 'update',
        context: 'any',
        description: 'Update company',
        feature_id:
          features.find(
            (f) => f.name === 'Companies',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_company',
        name: 'Delete Company',
        resource: 'company',
        action: 'delete',
        context: 'any',
        description: 'Soft delete company',
        feature_id:
          features.find(
            (f) => f.name === 'Companies',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_showroom_bank_diposit',
        name: 'Create Showroom Bank Diposit',
        resource: 'showroombankdiposit',
        action: 'create',
        context: 'any',
        description:
          'Create a showroom bank diposit with optional slip attachment URL',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Showroom Bank Diposit',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'list_showroom_bank_diposit',
        name: 'List Showroom Bank Diposit',
        resource: 'showroombankdiposit',
        action: 'list',
        context: 'any',
        description:
          'Get all showroom bank diposit entries (paginated & filtered)',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Showroom Bank Diposit',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_showroom_bank_diposit',
        name: 'View Showroom Bank Diposit',
        resource: 'showroombankdiposit',
        action: 'read',
        context: 'any',
        description:
          'Get showroom bank diposit by UUID',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Showroom Bank Diposit',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_showroom_bank_diposit',
        name: 'Update Showroom Bank Diposit',
        resource: 'showroombankdiposit',
        action: 'update',
        context: 'any',
        description:
          'Update showroom bank diposit by UUID with optional new slip attachment URL',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Showroom Bank Diposit',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_showroom_bank_diposit',
        name: 'Delete Showroom Bank Diposit',
        resource: 'showroombankdiposit',
        action: 'delete',
        context: 'any',
        description:
          'Soft delete showroom bank diposit by UUID',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Showroom Bank Diposit',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'force_delete_showroom_bank_diposit',
        name: 'Force Delete Showroom Bank Diposit',
        resource: 'showroombankdiposit',
        action: 'delete',
        context: 'any',
        description:
          'Hard delete (permanent) showroom bank diposit by UUID',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Showroom Bank Diposit',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_showroom_bank_diposit',
        name: 'Restore Showroom Bank Diposit',
        resource: 'showroombankdiposit',
        action: 'update',
        context: 'any',
        description:
          'Restore a soft-deleted showroom bank diposit by UUID',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Showroom Bank Diposit',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_promotion',
        name: 'Create Promotion',
        resource: 'promotion',
        action: 'create',
        context: 'any',
        description: 'Create a new promotion',
        feature_id:
          features.find(
            (f) => f.name === 'Promotions',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'list_promotions',
        name: 'List Promotions',
        resource: 'promotion',
        action: 'list',
        context: 'any',
        description:
          'Get all promotions (paginated & filtered)',
        feature_id:
          features.find(
            (f) => f.name === 'Promotions',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_promotion',
        name: 'View Promotion',
        resource: 'promotion',
        action: 'read',
        context: 'any',
        description: 'Get a promotion by UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Promotions',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_promotion',
        name: 'Update Promotion',
        resource: 'promotion',
        action: 'update',
        context: 'any',
        description: 'Update a promotion',
        feature_id:
          features.find(
            (f) => f.name === 'Promotions',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_promotion',
        name: 'Delete Promotion',
        resource: 'promotion',
        action: 'delete',
        context: 'any',
        description: 'Delete a promotion',
        feature_id:
          features.find(
            (f) => f.name === 'Promotions',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'bulk_update_promotions',
        name: 'Bulk Update Promotions',
        resource: 'promotions',
        action: 'read',
        context: 'any',
        description:
          'Bulk update promotion status',
        feature_id:
          features.find(
            (f) => f.name === 'Promotions',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'bulk_delete_promotions',
        name: 'Bulk Delete Promotions',
        resource: 'promotions',
        action: 'read',
        context: 'any',
        description: 'Bulk delete promotions',
        feature_id:
          features.find(
            (f) => f.name === 'Promotions',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_promotion_category',
        name: 'Create Promotion Category',
        resource: 'promotioncategory',
        action: 'create',
        context: 'any',
        description:
          'Create a new promotion category',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Promotion Categories',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'list_promotion_categories',
        name: 'List Promotion Categories',
        resource: 'promotioncategory',
        action: 'list',
        context: 'any',
        description:
          'Get all promotion categories (paginated & filtered)',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Promotion Categories',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_promotion_category',
        name: 'View Promotion Category',
        resource: 'promotioncategory',
        action: 'read',
        context: 'any',
        description:
          'Get a promotion category by UUID',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Promotion Categories',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_promotion_category',
        name: 'Update Promotion Category',
        resource: 'promotioncategory',
        action: 'update',
        context: 'any',
        description:
          'Update a promotion category',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Promotion Categories',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_promotion_category',
        name: 'Delete Promotion Category',
        resource: 'promotioncategory',
        action: 'delete',
        context: 'any',
        description:
          'Delete a promotion category',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Promotion Categories',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_sales',
        name: 'View Sales',
        resource: 'sales',
        action: 'read',
        context: 'any',
        description:
          'Allows read action on any sales resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Pos Sale',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_sale',
        name: 'View Sale',
        resource: 'sale',
        action: 'read',
        context: 'any',
        description:
          'Allows read action on any sale resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Pos Sale',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_pos_price_declaration',
        name: 'Create Pos Price Declaration',
        resource: 'pospricedeclaration',
        action: 'create',
        context: 'any',
        description:
          'Create a new pos product price declaration item',
        feature_id:
          features.find(
            (f) => f.name === 'Price Declaration',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'list_pos_price_declaration',
        name: 'List Pos Price Declaration',
        resource: 'pospricedeclaration',
        action: 'list',
        context: 'any',
        description:
          'Get barcode print dropdown filters with final price declaration list',
        feature_id:
          features.find(
            (f) => f.name === 'Price Declaration',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'list_barcode_dropdown',
        name: 'List Barcode Dropdown',
        resource: 'barcodedropdown',
        action: 'list',
        context: 'any',
        description:
          'Get product wise dropdown list',
        feature_id:
          features.find(
            (f) => f.name === 'Price Declaration',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'available-sizes',
        name: 'Available Sizes',
        resource: 'pricedeclaration',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: available-sizes',
        feature_id:
          features.find(
            (f) => f.name === 'Price Declaration',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'read_pos_price_declaration',
        name: 'Read Pos Price Declaration',
        resource: 'pospricedeclaration',
        action: 'read',
        context: 'any',
        description:
          'Get grouped price declaration items by pdSerial',
        feature_id:
          features.find(
            (f) => f.name === 'Price Declaration',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_pos_price_declaration',
        name: 'Update Pos Price Declaration',
        resource: 'pospricedeclaration',
        action: 'update',
        context: 'any',
        description:
          'Update a price declarationt item by UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Price Declaration',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_pos_price_declaration',
        name: 'Delete Pos Price Declaration',
        resource: 'pospricedeclaration',
        action: 'delete',
        context: 'any',
        description:
          'Soft delete a price declarationt item',
        feature_id:
          features.find(
            (f) => f.name === 'Price Declaration',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_pos_price_declaration',
        name: 'Restore Pos Price Declaration',
        resource: 'pospricedeclaration',
        action: 'update',
        context: 'any',
        description:
          'Restore a soft-deleted price declarationt item',
        feature_id:
          features.find(
            (f) => f.name === 'Price Declaration',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_pay_scale',
        name: 'Create Pay Scale',
        resource: 'payscale',
        action: 'create',
        context: 'any',
        description: 'Create a new pay scale',
        feature_id:
          features.find(
            (f) => f.name === 'PayScale',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_pay_scales',
        name: 'View Pay Scales',
        resource: 'payscales',
        action: 'read',
        context: 'any',
        description:
          'Get active pay scales for dropdown',
        feature_id:
          features.find(
            (f) => f.name === 'PayScale',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_pay_scale',
        name: 'View Pay Scale',
        resource: 'payscale',
        action: 'read',
        context: 'any',
        description: 'Get pay scale by ID',
        feature_id:
          features.find(
            (f) => f.name === 'PayScale',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_pay_scale',
        name: 'Update Pay Scale',
        resource: 'payscale',
        action: 'update',
        context: 'any',
        description: 'Update pay scale',
        feature_id:
          features.find(
            (f) => f.name === 'PayScale',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_pay_scale',
        name: 'Delete Pay Scale',
        resource: 'payscale',
        action: 'delete',
        context: 'any',
        description: 'Soft delete pay scale',
        feature_id:
          features.find(
            (f) => f.name === 'PayScale',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_pay_scale',
        name: 'Restore Pay Scale',
        resource: 'payscale',
        action: 'update',
        context: 'any',
        description:
          'Restore soft-deleted pay scale',
        feature_id:
          features.find(
            (f) => f.name === 'PayScale',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_godown',
        name: 'Create Godown',
        resource: 'godown',
        action: 'create',
        context: 'any',
        description: 'Create a new godown',
        feature_id:
          features.find(
            (f) => f.name === 'Godown',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_godowns',
        name: 'View Godowns',
        resource: 'godown',
        action: 'read',
        context: 'any',
        description:
          'Get all godowns (paginated & filtered)',
        feature_id:
          features.find(
            (f) => f.name === 'Godown',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_godown',
        name: 'View Godown',
        resource: 'godown',
        action: 'read',
        context: 'any',
        description: 'Get godown by ID',
        feature_id:
          features.find(
            (f) => f.name === 'Godown',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_godown',
        name: 'Update Godown',
        resource: 'godown',
        action: 'update',
        context: 'any',
        description: 'Update godown',
        feature_id:
          features.find(
            (f) => f.name === 'Godown',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_godown',
        name: 'Delete Godown',
        resource: 'godown',
        action: 'delete',
        context: 'any',
        description: 'Soft delete godown',
        feature_id:
          features.find(
            (f) => f.name === 'Godown',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_godown',
        name: 'Restore Godown',
        resource: 'godown',
        action: 'update',
        context: 'any',
        description:
          'Restore soft-deleted godown',
        feature_id:
          features.find(
            (f) => f.name === 'Godown',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_distribution',
        name: 'Create Distribution',
        resource: 'distribution',
        action: 'create',
        context: 'any',
        description: 'Create a new distribution',
        feature_id:
          features.find(
            (f) => f.name === 'Distribution',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_distributions',
        name: 'View Distributions',
        resource: 'distribution',
        action: 'read',
        context: 'any',
        description:
          'Get all distributions (paginated & filtered)',
        feature_id:
          features.find(
            (f) => f.name === 'Distribution',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_distribution',
        name: 'View Distribution',
        resource: 'distribution',
        action: 'read',
        context: 'any',
        description: 'Get distribution by ID',
        feature_id:
          features.find(
            (f) => f.name === 'Distribution',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_distribution',
        name: 'Update Distribution',
        resource: 'distribution',
        action: 'update',
        context: 'any',
        description: 'Update distribution',
        feature_id:
          features.find(
            (f) => f.name === 'Distribution',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_distribution',
        name: 'Delete Distribution',
        resource: 'distribution',
        action: 'delete',
        context: 'any',
        description: 'Soft delete distribution',
        feature_id:
          features.find(
            (f) => f.name === 'Distribution',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_distribution',
        name: 'Restore Distribution',
        resource: 'distribution',
        action: 'update',
        context: 'any',
        description:
          'Restore soft-deleted distribution',
        feature_id:
          features.find(
            (f) => f.name === 'Distribution',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_designation',
        name: 'Create Designation',
        resource: 'designation',
        action: 'create',
        context: 'any',
        description: 'Create a new designation',
        feature_id:
          features.find(
            (f) => f.name === 'Designation',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_designations',
        name: 'View Designations',
        resource: 'designation',
        action: 'read',
        context: 'any',
        description: 'Get all designations',
        feature_id:
          features.find(
            (f) => f.name === 'Designation',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_designation',
        name: 'View Designation',
        resource: 'designation',
        action: 'read',
        context: 'any',
        description: 'Get designation by ID',
        feature_id:
          features.find(
            (f) => f.name === 'Designation',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_designation',
        name: 'Update Designation',
        resource: 'designation',
        action: 'update',
        context: 'any',
        description: 'Update designation',
        feature_id:
          features.find(
            (f) => f.name === 'Designation',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_designation',
        name: 'Delete Designation',
        resource: 'designation',
        action: 'delete',
        context: 'any',
        description: 'Soft delete designation',
        feature_id:
          features.find(
            (f) => f.name === 'Designation',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_designation',
        name: 'Restore Designation',
        resource: 'designation',
        action: 'update',
        context: 'any',
        description:
          'Restore soft-deleted designation',
        feature_id:
          features.find(
            (f) => f.name === 'Designation',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_department',
        name: 'Create Department',
        resource: 'department',
        action: 'create',
        context: 'any',
        description: 'Create a new department',
        feature_id:
          features.find(
            (f) => f.name === 'Department',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_departments',
        name: 'View Departments',
        resource: 'department',
        action: 'read',
        context: 'any',
        description: 'Get all departments',
        feature_id:
          features.find(
            (f) => f.name === 'Department',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_department',
        name: 'View Department',
        resource: 'department',
        action: 'read',
        context: 'any',
        description: 'Get department by ID',
        feature_id:
          features.find(
            (f) => f.name === 'Department',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_department',
        name: 'Update Department',
        resource: 'department',
        action: 'update',
        context: 'any',
        description: 'Update department',
        feature_id:
          features.find(
            (f) => f.name === 'Department',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_department',
        name: 'Delete Department',
        resource: 'department',
        action: 'delete',
        context: 'any',
        description: 'Soft delete department',
        feature_id:
          features.find(
            (f) => f.name === 'Department',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_department',
        name: 'Restore Department',
        resource: 'department',
        action: 'update',
        context: 'any',
        description:
          'Restore soft-deleted department',
        feature_id:
          features.find(
            (f) => f.name === 'Department',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_customer',
        name: 'Create Customer',
        resource: 'customer',
        action: 'create',
        context: 'any',
        description: 'Create a new customer',
        feature_id:
          features.find(
            (f) => f.name === 'Customers',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_customers',
        name: 'View Customers',
        resource: 'customer',
        action: 'read',
        context: 'any',
        description:
          'Get all customers (paginated & filtered)',
        feature_id:
          features.find(
            (f) => f.name === 'Customers',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_customer',
        name: 'Update Customer',
        resource: 'customer',
        action: 'update',
        context: 'any',
        description: 'Update customer',
        feature_id:
          features.find(
            (f) => f.name === 'Customers',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_customer',
        name: 'Delete Customer',
        resource: 'customer',
        action: 'delete',
        context: 'any',
        description: 'Soft delete customer',
        feature_id:
          features.find(
            (f) => f.name === 'Customers',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_country',
        name: 'Create Country',
        resource: 'country',
        action: 'create',
        context: 'any',
        description: 'Create a new country',
        feature_id:
          features.find(
            (f) => f.name === 'Country',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_countries',
        name: 'View Countries',
        resource: 'country',
        action: 'read',
        context: 'any',
        description:
          'Get all countries with pagination and filters',
        feature_id:
          features.find(
            (f) => f.name === 'Country',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_country',
        name: 'View Country',
        resource: 'country',
        action: 'read',
        context: 'any',
        description: 'Get country by slug',
        feature_id:
          features.find(
            (f) => f.name === 'Country',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_country',
        name: 'Update Country',
        resource: 'country',
        action: 'update',
        context: 'any',
        description: 'Update country',
        feature_id:
          features.find(
            (f) => f.name === 'Country',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_countries',
        name: 'Update Countries',
        resource: 'country',
        action: 'update',
        context: 'any',
        description: 'Bulk update country status',
        feature_id:
          features.find(
            (f) => f.name === 'Country',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_country',
        name: 'Restore Country',
        resource: 'country',
        action: 'update',
        context: 'any',
        description:
          'Restore soft-deleted country',
        feature_id:
          features.find(
            (f) => f.name === 'Country',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'soft_delete_country',
        name: 'Soft Delete Country',
        resource: 'country',
        action: 'delete',
        context: 'any',
        description: 'Soft delete country',
        feature_id:
          features.find(
            (f) => f.name === 'Country',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_country',
        name: 'Delete Country',
        resource: 'country',
        action: 'delete',
        context: 'any',
        description: 'Permanently delete country',
        feature_id:
          features.find(
            (f) => f.name === 'Country',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_brand',
        name: 'Create Brand',
        resource: 'brand',
        action: 'create',
        context: 'any',
        description: 'Create a new brand',
        feature_id:
          features.find((f) => f.name === 'Brand')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_brands',
        name: 'View Brands',
        resource: 'brand',
        action: 'read',
        context: 'any',
        description:
          'Get all brands with pagination and filters',
        feature_id:
          features.find((f) => f.name === 'Brand')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_brand',
        name: 'View Brand',
        resource: 'brand',
        action: 'read',
        context: 'any',
        description: 'Get brand by ID',
        feature_id:
          features.find((f) => f.name === 'Brand')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_brand',
        name: 'Update Brand',
        resource: 'brand',
        action: 'update',
        context: 'any',
        description: 'Update brand',
        feature_id:
          features.find((f) => f.name === 'Brand')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_brand',
        name: 'Restore Brand',
        resource: 'brand',
        action: 'update',
        context: 'any',
        description: 'Restore soft-deleted brand',
        feature_id:
          features.find((f) => f.name === 'Brand')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'soft_delete_brand',
        name: 'Soft Delete Brand',
        resource: 'brand',
        action: 'delete',
        context: 'any',
        description: 'Soft delete brand',
        feature_id:
          features.find((f) => f.name === 'Brand')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_showroom_counter',
        name: 'Create Showroom Counter',
        resource: 'showroomcounter',
        action: 'create',
        context: 'any',
        description:
          'Create a new showroom counter',
        feature_id:
          features.find(
            (f) => f.name === 'Showroom Counters',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'list_showroom_counter',
        name: 'List Showroom Counter',
        resource: 'showroomcounter',
        action: 'list',
        context: 'any',
        description:
          'List showroom counters (paginated & filtered)',
        feature_id:
          features.find(
            (f) => f.name === 'Showroom Counters',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_showroom_counter',
        name: 'View Showroom Counter',
        resource: 'showroomcounter',
        action: 'read',
        context: 'any',
        description: 'Get showroom counter by id',
        feature_id:
          features.find(
            (f) => f.name === 'Showroom Counters',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_showroom_counter',
        name: 'Update Showroom Counter',
        resource: 'showroomcounter',
        action: 'update',
        context: 'any',
        description: 'Update showroom counter',
        feature_id:
          features.find(
            (f) => f.name === 'Showroom Counters',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_showroom_counter',
        name: 'Delete Showroom Counter',
        resource: 'showroomcounter',
        action: 'delete',
        context: 'any',
        description:
          'Soft delete showroom counter',
        feature_id:
          features.find(
            (f) => f.name === 'Showroom Counters',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'force_delete_showroom_counter',
        name: 'Force Delete Showroom Counter',
        resource: 'showroomcounter',
        action: 'delete',
        context: 'any',
        description:
          'Hard delete (permanent) showroom counter — requires soft-delete first',
        feature_id:
          features.find(
            (f) => f.name === 'Showroom Counters',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_showroom_counter',
        name: 'Restore Showroom Counter',
        resource: 'showroomcounter',
        action: 'update',
        context: 'any',
        description:
          'Restore a soft-deleted showroom counter',
        feature_id:
          features.find(
            (f) => f.name === 'Showroom Counters',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_sales_returns',
        name: 'View Sales Returns',
        resource: 'salesreturn',
        action: 'read',
        context: 'any',
        description: 'Return report',
        feature_id:
          features.find(
            (f) => f.name === 'Sale Reports',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'manage_operation_summary',
        name: 'Manage Operation Summary',
        resource: 'salereports',
        action: 'read',
        context: 'any',
        description:
          'Manually store operation summary',
        feature_id:
          features.find(
            (f) => f.name === 'Sale Reports',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'branch_stock_view',
        name: 'Showroom Stock View',
        resource: 'shawroomstockmanagement',
        action: 'read',
        context: 'any',
        description: 'Get stock log report',
        feature_id:
          features.find(
            (f) =>
              f.name ===
              'Shawroom Stock Management',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'transit_stock_view',
        name: 'Transit Stock View',
        resource: 'transitstockmanagement',
        action: 'read',
        context: 'any',
        description:
          'Get transit stock log report',
        feature_id:
          features.find(
            (f) =>
              f.name ===
              'Transit Stock Management',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_packaging_create',
        name: 'Finishing Packaging Create',
        resource: 'packaging',
        action: 'read',
        context: 'any',
        description: 'Create new packaging',
        feature_id:
          features.find(
            (f) => f.name === 'Packaging',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_packaging_view',
        name: 'Finishing Packaging View',
        resource: 'packaging',
        action: 'read',
        context: 'any',
        description:
          'Get all packaging with filters',
        feature_id:
          features.find(
            (f) => f.name === 'Packaging',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_packaging_edit',
        name: 'Finishing Packaging Edit',
        resource: 'packaging',
        action: 'read',
        context: 'any',
        description: 'Update finishing packaging',
        feature_id:
          features.find(
            (f) => f.name === 'Packaging',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_packaging_create',
        name: 'Distribution Packaging Create',
        resource: 'packaging',
        action: 'read',
        context: 'any',
        description: 'Create new packaging',
        feature_id:
          features.find(
            (f) => f.name === 'Packaging',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_packaging_view',
        name: 'Distribution Packaging View',
        resource: 'packaging',
        action: 'read',
        context: 'any',
        description:
          'Get all packaging with filters',
        feature_id:
          features.find(
            (f) => f.name === 'Packaging',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_packaging_edit',
        name: 'Distribution Packaging Edit',
        resource: 'packaging',
        action: 'read',
        context: 'any',
        description:
          'Update distribution packaging',
        feature_id:
          features.find(
            (f) => f.name === 'Packaging',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'branch_packaging_create',
        name: 'Branch Packaging Create',
        resource: 'packaging',
        action: 'read',
        context: 'any',
        description:
          'Create new warehouse packaging',
        feature_id:
          features.find(
            (f) => f.name === 'Packaging',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'branch_packaging_view',
        name: 'Branch Packaging View',
        resource: 'packaging',
        action: 'read',
        context: 'any',
        description:
          'Get all warehouse packaging with filters',
        feature_id:
          features.find(
            (f) => f.name === 'Packaging',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'branch_packaging_edit',
        name: 'Branch Packaging Edit',
        resource: 'packaging',
        action: 'read',
        context: 'any',
        description: 'Update warehouse packaging',
        feature_id:
          features.find(
            (f) => f.name === 'Packaging',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_packaging_delete',
        name: 'Finishing Packaging Delete',
        resource: 'packaging',
        action: 'read',
        context: 'any',
        description:
          'Delete finishing packaging (soft delete)',
        feature_id:
          features.find(
            (f) => f.name === 'Packaging',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_packaging_delete',
        name: 'Distribution Packaging Delete',
        resource: 'packaging',
        action: 'read',
        context: 'any',
        description:
          'Delete distribution packaging (soft delete)',
        feature_id:
          features.find(
            (f) => f.name === 'Packaging',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'branch_packaging_delete',
        name: 'Branch Packaging Delete',
        resource: 'packaging',
        action: 'read',
        context: 'any',
        description:
          'Delete warehouse packaging (soft delete)',
        feature_id:
          features.find(
            (f) => f.name === 'Packaging',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'import_bill_create',
        name: 'Import Bill Create',
        resource: 'finishingstockmanagement',
        action: 'read',
        context: 'any',
        description:
          'Create a new stock log entry',
        feature_id:
          features.find(
            (f) =>
              f.name ===
              'Finishing Stock Management',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_stock_log_view',
        name: 'Finishing Stock Log View',
        resource: 'finishingstockmanagement',
        action: 'read',
        context: 'any',
        description:
          'Get all stock log entries with filtering',
        feature_id:
          features.find(
            (f) =>
              f.name ===
              'Finishing Stock Management',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_stock_report',
        name: 'Finishing Stock Report',
        resource: 'finishingstockmanagement',
        action: 'read',
        context: 'any',
        description: 'Get current stock snapshot',
        feature_id:
          features.find(
            (f) =>
              f.name ===
              'Finishing Stock Management',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'import_bill_view',
        name: 'Import Bill View',
        resource: 'finishingstockmanagement',
        action: 'read',
        context: 'any',
        description:
          'Get import bills with filtering',
        feature_id:
          features.find(
            (f) =>
              f.name ===
              'Finishing Stock Management',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_stock_adjustment',
        name: 'Finishing Stock Adjustment',
        resource: 'finishingstockmanagement',
        action: 'read',
        context: 'any',
        description: 'Create a stock adjustment',
        feature_id:
          features.find(
            (f) =>
              f.name ===
              'Finishing Stock Management',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_stock_view',
        name: 'Distribution Stock View',
        resource: 'distributionstockmanagement',
        action: 'read',
        context: 'any',
        description: 'Get stock log report',
        feature_id:
          features.find(
            (f) =>
              f.name ===
              'Distribution Stock Management',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_style',
        name: 'Create Style',
        resource: 'style',
        action: 'create',
        context: 'any',
        description: 'Create a new style',
        feature_id:
          features.find(
            (f) => f.name === 'Styles',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_styles',
        name: 'View Styles',
        resource: 'styles',
        action: 'read',
        context: 'any',
        description:
          'Get styles with optional pagination',
        feature_id:
          features.find(
            (f) => f.name === 'Styles',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_style',
        name: 'View Style',
        resource: 'style',
        action: 'read',
        context: 'any',
        description: 'Get style by ID',
        feature_id:
          features.find(
            (f) => f.name === 'Styles',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_style',
        name: 'Update Style',
        resource: 'style',
        action: 'update',
        context: 'any',
        description: 'Update style',
        feature_id:
          features.find(
            (f) => f.name === 'Styles',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_style',
        name: 'Delete Style',
        resource: 'style',
        action: 'delete',
        context: 'any',
        description: 'Soft delete style',
        feature_id:
          features.find(
            (f) => f.name === 'Styles',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_size',
        name: 'Create Size',
        resource: 'size',
        action: 'create',
        context: 'any',
        description: 'Create a new size',
        feature_id:
          features.find((f) => f.name === 'Sizes')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_sizes',
        name: 'View Sizes',
        resource: 'sizes',
        action: 'read',
        context: 'any',
        description:
          'Get sizes with pagination and optional filters',
        feature_id:
          features.find((f) => f.name === 'Sizes')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_size',
        name: 'View Size',
        resource: 'size',
        action: 'read',
        context: 'any',
        description: 'Get size by ID',
        feature_id:
          features.find((f) => f.name === 'Sizes')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_size',
        name: 'Update Size',
        resource: 'size',
        action: 'update',
        context: 'any',
        description: 'Update size information',
        feature_id:
          features.find((f) => f.name === 'Sizes')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_size',
        name: 'Delete Size',
        resource: 'size',
        action: 'delete',
        context: 'any',
        description: 'Soft delete a size',
        feature_id:
          features.find((f) => f.name === 'Sizes')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_color',
        name: 'Create Color',
        resource: 'color',
        action: 'create',
        context: 'any',
        description: 'Create a new color',
        feature_id:
          features.find(
            (f) => f.name === 'Colors',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_colors',
        name: 'View Colors',
        resource: 'color',
        action: 'read',
        context: 'any',
        description:
          'Get all colors with optional pagination',
        feature_id:
          features.find(
            (f) => f.name === 'Colors',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_color',
        name: 'View Color',
        resource: 'color',
        action: 'read',
        context: 'any',
        description: 'Get color by ID',
        feature_id:
          features.find(
            (f) => f.name === 'Colors',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_color',
        name: 'Update Color',
        resource: 'color',
        action: 'update',
        context: 'any',
        description: 'Update color information',
        feature_id:
          features.find(
            (f) => f.name === 'Colors',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_color',
        name: 'Delete Color',
        resource: 'color',
        action: 'delete',
        context: 'any',
        description: 'Soft delete a color',
        feature_id:
          features.find(
            (f) => f.name === 'Colors',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_pos_product',
        name: 'Create Pos Product',
        resource: 'posproduct',
        action: 'create',
        context: 'any',
        description: 'Create a new POS Product',
        feature_id:
          features.find(
            (f) => f.name === 'Products',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_pos_products',
        name: 'View Pos Products',
        resource: 'posproduct',
        action: 'read',
        context: 'any',
        description:
          'Get all POS Products with advanced filtering, pagination & search',
        feature_id:
          features.find(
            (f) => f.name === 'Products',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_pos_product',
        name: 'View Pos Product',
        resource: 'posproduct',
        action: 'read',
        context: 'any',
        description: 'Get POS Product by ID',
        feature_id:
          features.find(
            (f) => f.name === 'Products',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_pos_product',
        name: 'Update Pos Product',
        resource: 'posproduct',
        action: 'update',
        context: 'any',
        description: 'Update POS Product',
        feature_id:
          features.find(
            (f) => f.name === 'Products',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_pos_product_pricing',
        name: 'Update Pos Product Pricing',
        resource: 'posproductpricing',
        action: 'update',
        context: 'any',
        description: 'Update POS Product Pricing',
        feature_id:
          features.find(
            (f) => f.name === 'Products',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_category_size',
        name: 'Create Category Size',
        resource: 'categorysize',
        action: 'create',
        context: 'any',
        description:
          'Create category-size mapping',
        feature_id:
          features.find(
            (f) => f.name === 'Category Size',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_category_sizes',
        name: 'View Category Sizes',
        resource: 'categorysizes',
        action: 'read',
        context: 'any',
        description:
          'Get all category-size mappings',
        feature_id:
          features.find(
            (f) => f.name === 'Category Size',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_category_size',
        name: 'View Category Size',
        resource: 'categorysize',
        action: 'read',
        context: 'any',
        description: 'Get category-size by ID',
        feature_id:
          features.find(
            (f) => f.name === 'Category Size',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'reorder_category_size',
        name: 'Reorder Category Size',
        resource: 'categorysize',
        action: 'read',
        context: 'any',
        description:
          'Reorder sizes within a category',
        feature_id:
          features.find(
            (f) => f.name === 'Category Size',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_category_size',
        name: 'Update Category Size',
        resource: 'categorysize',
        action: 'update',
        context: 'any',
        description:
          'Update category-size mapping',
        feature_id:
          features.find(
            (f) => f.name === 'Category Size',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_category_size',
        name: 'Delete Category Size',
        resource: 'categorysize',
        action: 'delete',
        context: 'any',
        description:
          'Soft delete category-size mapping',
        feature_id:
          features.find(
            (f) => f.name === 'Category Size',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_category',
        name: 'Create Category',
        resource: 'category',
        action: 'create',
        context: 'any',
        description: 'Create a new category',
        feature_id:
          features.find(
            (f) => f.name === 'Categories',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_categories',
        name: 'View Categories',
        resource: 'category',
        action: 'read',
        context: 'any',
        description:
          'Get all categories with optional pagination',
        feature_id:
          features.find(
            (f) => f.name === 'Categories',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_banks',
        name: 'View Banks',
        resource: 'bank',
        action: 'read',
        context: 'any',
        description:
          'Get slug suggestions for a name',
        feature_id:
          features.find(
            (f) => f.name === 'Categories',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_category',
        name: 'View Category',
        resource: 'category',
        action: 'read',
        context: 'any',
        description: 'Get category by ID',
        feature_id:
          features.find(
            (f) => f.name === 'Categories',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_category',
        name: 'Update Category',
        resource: 'category',
        action: 'update',
        context: 'any',
        description: 'Update category',
        feature_id:
          features.find(
            (f) => f.name === 'Categories',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_category',
        name: 'Delete Category',
        resource: 'category',
        action: 'delete',
        context: 'any',
        description: 'Soft delete category',
        feature_id:
          features.find(
            (f) => f.name === 'Categories',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_shift',
        name: 'Create Shift',
        resource: 'shift',
        action: 'create',
        context: 'any',
        description: 'Create a new shift',
        feature_id:
          features.find((f) => f.name === 'Shift')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_shifts',
        name: 'View Shifts',
        resource: 'shift',
        action: 'read',
        context: 'any',
        description:
          'Allows read action on any shift resource.',
        feature_id:
          features.find((f) => f.name === 'Shift')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_shift',
        name: 'View Shift',
        resource: 'shift',
        action: 'read',
        context: 'any',
        description:
          'Allows read action on any shift resource.',
        feature_id:
          features.find((f) => f.name === 'Shift')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_shift',
        name: 'Update Shift',
        resource: 'shift',
        action: 'update',
        context: 'any',
        description:
          'Allows update action on any shift resource.',
        feature_id:
          features.find((f) => f.name === 'Shift')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_shift',
        name: 'Delete Shift',
        resource: 'shift',
        action: 'delete',
        context: 'any',
        description:
          'Allows delete action on any shift resource.',
        feature_id:
          features.find((f) => f.name === 'Shift')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_shift',
        name: 'Restore Shift',
        resource: 'shift',
        action: 'update',
        context: 'any',
        description:
          'Allows update action on any shift resource.',
        feature_id:
          features.find((f) => f.name === 'Shift')
            ?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_weekly_holiday',
        name: 'Create Weekly Holiday',
        resource: 'weeklyholiday',
        action: 'create',
        context: 'any',
        description: 'Create weekly holiday',
        feature_id:
          features.find(
            (f) => f.name === 'Weekly Holiday',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'list_weekly_holiday',
        name: 'List Weekly Holiday',
        resource: 'weeklyholiday',
        action: 'list',
        context: 'any',
        description: 'List weekly holidays',
        feature_id:
          features.find(
            (f) => f.name === 'Weekly Holiday',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'read_weekly_holiday',
        name: 'Read Weekly Holiday',
        resource: 'weeklyholiday',
        action: 'read',
        context: 'any',
        description: 'Get single weekly holiday',
        feature_id:
          features.find(
            (f) => f.name === 'Weekly Holiday',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_weekly_holiday',
        name: 'Update Weekly Holiday',
        resource: 'weeklyholiday',
        action: 'update',
        context: 'any',
        description: 'Update weekly holiday',
        feature_id:
          features.find(
            (f) => f.name === 'Weekly Holiday',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_weekly_holiday',
        name: 'Delete Weekly Holiday',
        resource: 'weeklyholiday',
        action: 'delete',
        context: 'any',
        description: 'Delete weekly holiday',
        feature_id:
          features.find(
            (f) => f.name === 'Weekly Holiday',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_sub_department',
        name: 'Create Sub Department',
        resource: 'subdepartment',
        action: 'create',
        context: 'any',
        description: 'Create sub department',
        feature_id:
          features.find(
            (f) => f.name === 'Sub Department',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'list_sub_department',
        name: 'List Sub Department',
        resource: 'subdepartment',
        action: 'list',
        context: 'any',
        description: 'List sub departments',
        feature_id:
          features.find(
            (f) => f.name === 'Sub Department',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'read_sub_department',
        name: 'Read Sub Department',
        resource: 'subdepartment',
        action: 'read',
        context: 'any',
        description: 'Get single sub department',
        feature_id:
          features.find(
            (f) => f.name === 'Sub Department',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_sub_department',
        name: 'Update Sub Department',
        resource: 'subdepartment',
        action: 'update',
        context: 'any',
        description: 'Update sub department',
        feature_id:
          features.find(
            (f) => f.name === 'Sub Department',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_sub_department',
        name: 'Delete Sub Department',
        resource: 'subdepartment',
        action: 'delete',
        context: 'any',
        description: 'Delete sub department',
        feature_id:
          features.find(
            (f) => f.name === 'Sub Department',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_salary_grade',
        name: 'Create Salary Grade',
        resource: 'salarygrade',
        action: 'create',
        context: 'any',
        description:
          'Salary grade added with components',
        feature_id:
          features.find(
            (f) => f.name === 'Salary Grade',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_salary_grade',
        name: 'View Salary Grade',
        resource: 'salarygrade',
        action: 'read',
        context: 'any',
        description:
          'Get all salary grades with components',
        feature_id:
          features.find(
            (f) => f.name === 'Salary Grade',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_salary_grade',
        name: 'Update Salary Grade',
        resource: 'salarygrade',
        action: 'update',
        context: 'any',
        description:
          'Update salary grade by UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Salary Grade',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_salary_grade',
        name: 'Delete Salary Grade',
        resource: 'salarygrade',
        action: 'delete',
        context: 'any',
        description: 'Soft delete salary grade',
        feature_id:
          features.find(
            (f) => f.name === 'Salary Grade',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_salary_grade',
        name: 'Restore Salary Grade',
        resource: 'salarygrade',
        action: 'update',
        context: 'any',
        description:
          'Restore soft-deleted salary grade',
        feature_id:
          features.find(
            (f) => f.name === 'Salary Grade',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_office_time',
        name: 'Create Office Time',
        resource: 'officetime',
        action: 'create',
        context: 'any',
        description: 'Create office time',
        feature_id:
          features.find(
            (f) => f.name === 'Office Time',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'list_office_time',
        name: 'List Office Time',
        resource: 'officetime',
        action: 'list',
        context: 'any',
        description: 'List office times',
        feature_id:
          features.find(
            (f) => f.name === 'Office Time',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'read_office_time',
        name: 'Read Office Time',
        resource: 'officetime',
        action: 'read',
        context: 'any',
        description: 'Get single office time',
        feature_id:
          features.find(
            (f) => f.name === 'Office Time',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_office_time',
        name: 'Update Office Time',
        resource: 'officetime',
        action: 'update',
        context: 'any',
        description: 'Update office time',
        feature_id:
          features.find(
            (f) => f.name === 'Office Time',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_office_time',
        name: 'Delete Office Time',
        resource: 'officetime',
        action: 'delete',
        context: 'any',
        description: 'Delete office time',
        feature_id:
          features.find(
            (f) => f.name === 'Office Time',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_shift_group',
        name: 'Create Shift Group',
        resource: 'shiftgroup',
        action: 'create',
        context: 'any',
        description:
          'Allows create action on any shiftgroup resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Shift Group',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_shift_groups',
        name: 'View Shift Groups',
        resource: 'shiftgroup',
        action: 'read',
        context: 'any',
        description:
          'Allows read action on any shiftgroup resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Shift Group',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_shift_group',
        name: 'View Shift Group',
        resource: 'shiftgroup',
        action: 'read',
        context: 'any',
        description:
          'Allows read action on any shiftgroup resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Shift Group',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_shift_group',
        name: 'Update Shift Group',
        resource: 'shiftgroup',
        action: 'update',
        context: 'any',
        description: 'Update shift group by UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Shift Group',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_shift_group',
        name: 'Delete Shift Group',
        resource: 'shiftgroup',
        action: 'delete',
        context: 'any',
        description:
          'Allows delete action on any shiftgroup resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Shift Group',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_shift_group',
        name: 'Restore Shift Group',
        resource: 'shiftgroup',
        action: 'update',
        context: 'any',
        description:
          'Allows update action on any shiftgroup resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Shift Group',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_hrm_schedule',
        name: 'Create Hrm Schedule',
        resource: 'hrmschedule',
        action: 'create',
        context: 'any',
        description: 'Create schedule',
        feature_id:
          features.find(
            (f) => f.name === 'Schedule',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_hrm_schedule',
        name: 'View Hrm Schedule',
        resource: 'hrmschedule',
        action: 'read',
        context: 'any',
        description: 'Schedule list',
        feature_id:
          features.find(
            (f) => f.name === 'Schedule',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_hrm_schedule',
        name: 'Update Hrm Schedule',
        resource: 'hrmschedule',
        action: 'update',
        context: 'any',
        description: 'Update schedule',
        feature_id:
          features.find(
            (f) => f.name === 'Schedule',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_hrm_schedule',
        name: 'Delete Hrm Schedule',
        resource: 'hrmschedule',
        action: 'delete',
        context: 'any',
        description: 'Delete schedule',
        feature_id:
          features.find(
            (f) => f.name === 'Schedule',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_hrm_schedule',
        name: 'Restore Hrm Schedule',
        resource: 'hrmschedule',
        action: 'update',
        context: 'any',
        description: 'Restore schedule',
        feature_id:
          features.find(
            (f) => f.name === 'Schedule',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_salary_head',
        name: 'Create Salary Head',
        resource: 'salaryhead',
        action: 'create',
        context: 'any',
        description:
          'Allows create action on any salaryhead resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Salary Head',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_salary_heads',
        name: 'View Salary Heads',
        resource: 'salaryhead',
        action: 'read',
        context: 'any',
        description:
          'Allows read action on any salaryhead resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Salary Head',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_salary_head',
        name: 'View Salary Head',
        resource: 'salaryhead',
        action: 'read',
        context: 'any',
        description:
          'Allows read action on any salaryhead resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Salary Head',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_salary_head',
        name: 'Update Salary Head',
        resource: 'salaryhead',
        action: 'update',
        context: 'any',
        description:
          'Allows update action on any salaryhead resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Salary Head',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_salary_head',
        name: 'Delete Salary Head',
        resource: 'salaryhead',
        action: 'delete',
        context: 'any',
        description:
          'Allows delete action on any salaryhead resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Salary Head',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_salary_head',
        name: 'Restore Salary Head',
        resource: 'salaryhead',
        action: 'update',
        context: 'any',
        description:
          'Allows update action on any salaryhead resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Salary Head',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_salary_component',
        name: 'Create Salary Component',
        resource: 'salarycomponent',
        action: 'create',
        context: 'any',
        description: 'Create salary component',
        feature_id:
          features.find(
            (f) => f.name === 'Salary Component',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'list_salary_component',
        name: 'List Salary Component',
        resource: 'salarycomponent',
        action: 'list',
        context: 'any',
        description: 'List salary components',
        feature_id:
          features.find(
            (f) => f.name === 'Salary Component',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'read_salary_component',
        name: 'Read Salary Component',
        resource: 'salarycomponent',
        action: 'read',
        context: 'any',
        description:
          'Allows read action on any salarycomponent resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Salary Component',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_salary_component',
        name: 'Update Salary Component',
        resource: 'salarycomponent',
        action: 'update',
        context: 'any',
        description:
          'Allows update action on any salarycomponent resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Salary Component',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_salary_component',
        name: 'Delete Salary Component',
        resource: 'salarycomponent',
        action: 'delete',
        context: 'any',
        description:
          'Allows delete action on any salarycomponent resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Salary Component',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_salary_component',
        name: 'Restore Salary Component',
        resource: 'salarycomponent',
        action: 'update',
        context: 'any',
        description:
          'Allows update action on any salarycomponent resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Salary Component',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_overtime_break',
        name: 'Create Overtime Break',
        resource: 'overtimebreak',
        action: 'create',
        context: 'any',
        description:
          'Create new overtime break record',
        feature_id:
          features.find(
            (f) => f.name === 'Overtime Break',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_overtime_breaks',
        name: 'View Overtime Breaks',
        resource: 'overtimebreak',
        action: 'read',
        context: 'any',
        description:
          'Get all overtime breaks with pagination',
        feature_id:
          features.find(
            (f) => f.name === 'Overtime Break',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_overtime_break',
        name: 'View Overtime Break',
        resource: 'overtimebreak',
        action: 'read',
        context: 'any',
        description:
          'Get single overtime break by UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Overtime Break',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_overtime_break',
        name: 'Update Overtime Break',
        resource: 'overtimebreak',
        action: 'update',
        context: 'any',
        description:
          'Update overtime break by UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Overtime Break',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_overtime_break',
        name: 'Delete Overtime Break',
        resource: 'overtimebreak',
        action: 'delete',
        context: 'any',
        description:
          'Soft delete overtime break by UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Overtime Break',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_overtime_break',
        name: 'Restore Overtime Break',
        resource: 'overtimebreak',
        action: 'update',
        context: 'any',
        description:
          'Restore soft-deleted overtime break by UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Overtime Break',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_offday_attendance',
        name: 'Create Offday Attendance',
        resource: 'offdayattendance',
        action: 'create',
        context: 'any',
        description: 'Create new record',
        feature_id:
          features.find(
            (f) =>
              f.name ===
              'Offday Attendance Planning',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'list_offday_attendance',
        name: 'List Offday Attendance',
        resource: 'offdayattendance',
        action: 'list',
        context: 'any',
        description:
          'Get all records with pagination',
        feature_id:
          features.find(
            (f) =>
              f.name ===
              'Offday Attendance Planning',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'read_offday_attendance',
        name: 'Read Offday Attendance',
        resource: 'offdayattendance',
        action: 'read',
        context: 'any',
        description: 'Get single record by UUID',
        feature_id:
          features.find(
            (f) =>
              f.name ===
              'Offday Attendance Planning',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_offday_attendance',
        name: 'Update Offday Attendance',
        resource: 'offdayattendance',
        action: 'update',
        context: 'any',
        description: 'Update record by UUID',
        feature_id:
          features.find(
            (f) =>
              f.name ===
              'Offday Attendance Planning',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_offday_attendance',
        name: 'Delete Offday Attendance',
        resource: 'offdayattendance',
        action: 'delete',
        context: 'any',
        description: 'Soft delete record by UUID',
        feature_id:
          features.find(
            (f) =>
              f.name ===
              'Offday Attendance Planning',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_offday_attendance',
        name: 'Restore Offday Attendance',
        resource: 'offdayattendance',
        action: 'update',
        context: 'any',
        description:
          'Restore soft-deleted record by UUID',
        feature_id:
          features.find(
            (f) =>
              f.name ===
              'Offday Attendance Planning',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_leave_type',
        name: 'Create Leave Type',
        resource: 'leavetype',
        action: 'create',
        context: 'any',
        description: 'Create leave type',
        feature_id:
          features.find(
            (f) => f.name === 'Leave Type',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_leave_type',
        name: 'View Leave Type',
        resource: 'leavetype',
        action: 'read',
        context: 'any',
        description:
          'Allows read action on any leavetype resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Leave Type',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_leave_type',
        name: 'Update Leave Type',
        resource: 'leavetype',
        action: 'update',
        context: 'any',
        description:
          'Allows update action on any leavetype resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Leave Type',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_leave_type',
        name: 'Delete Leave Type',
        resource: 'leavetype',
        action: 'delete',
        context: 'any',
        description:
          'Allows delete action on any leavetype resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Leave Type',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_leave_type',
        name: 'Restore Leave Type',
        resource: 'leavetype',
        action: 'update',
        context: 'any',
        description:
          'Allows update action on any leavetype resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Leave Type',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_leave_application',
        name: 'Create Leave Application',
        resource: 'leaveapplication',
        action: 'create',
        context: 'any',
        description: 'Create leave application',
        feature_id:
          features.find(
            (f) => f.name === 'Leave Application',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'approve_leave_application',
        name: 'Approve Leave Application',
        resource: 'leaveapplication',
        action: 'read',
        context: 'any',
        description: 'Approve leave application',
        feature_id:
          features.find(
            (f) => f.name === 'Leave Application',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'reject_leave_application',
        name: 'Reject Leave Application',
        resource: 'leaveapplication',
        action: 'read',
        context: 'any',
        description: 'Reject leave application',
        feature_id:
          features.find(
            (f) => f.name === 'Leave Application',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_leave_application',
        name: 'View Leave Application',
        resource: 'leaveapplication',
        action: 'read',
        context: 'any',
        description: 'Get leave applications',
        feature_id:
          features.find(
            (f) => f.name === 'Leave Application',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_leave_application',
        name: 'Update Leave Application',
        resource: 'leaveapplication',
        action: 'update',
        context: 'any',
        description: 'Update leave application',
        feature_id:
          features.find(
            (f) => f.name === 'Leave Application',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_leave_application',
        name: 'Delete Leave Application',
        resource: 'leaveapplication',
        action: 'delete',
        context: 'any',
        description: 'Delete leave application',
        feature_id:
          features.find(
            (f) => f.name === 'Leave Application',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_leave_application',
        name: 'Restore Leave Application',
        resource: 'leaveapplication',
        action: 'update',
        context: 'any',
        description:
          'Restore deleted leave application',
        feature_id:
          features.find(
            (f) => f.name === 'Leave Application',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_holiday_config',
        name: 'Create Holiday Config',
        resource: 'holidayconfig',
        action: 'create',
        context: 'any',
        description: 'Create holiday config',
        feature_id:
          features.find(
            (f) => f.name === 'Holiday Config',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_holiday_config',
        name: 'View Holiday Config',
        resource: 'holidayconfig',
        action: 'read',
        context: 'any',
        description:
          'Allows read action on any holidayconfig resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Holiday Config',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_holiday_config',
        name: 'Update Holiday Config',
        resource: 'holidayconfig',
        action: 'update',
        context: 'any',
        description:
          'Allows update action on any holidayconfig resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Holiday Config',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_holiday_config',
        name: 'Delete Holiday Config',
        resource: 'holidayconfig',
        action: 'delete',
        context: 'any',
        description:
          'Allows delete action on any holidayconfig resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Holiday Config',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_holiday_config',
        name: 'Restore Holiday Config',
        resource: 'holidayconfig',
        action: 'update',
        context: 'any',
        description:
          'Allows update action on any holidayconfig resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Holiday Config',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_employee',
        name: 'View Employee',
        resource: 'employee',
        action: 'read',
        context: 'any',
        description:
          'Get employee training by Employee UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Employee Training',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_employee',
        name: 'Update Employee',
        resource: 'employee',
        action: 'update',
        context: 'any',
        description:
          'Update employee training by Employee UUID',
        feature_id:
          features.find(
            (f) => f.name === 'Employee Training',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_calendar',
        name: 'Create Calendar',
        resource: 'calendar',
        action: 'create',
        context: 'any',
        description: 'Create calendar',
        feature_id:
          features.find(
            (f) => f.name === 'Calendars',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_calendar',
        name: 'View Calendar',
        resource: 'calendar',
        action: 'read',
        context: 'any',
        description:
          'Allows read action on any calendar resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Calendars',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_calendar',
        name: 'Update Calendar',
        resource: 'calendar',
        action: 'update',
        context: 'any',
        description:
          'Allows update action on any calendar resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Calendars',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_calendar',
        name: 'Delete Calendar',
        resource: 'calendar',
        action: 'delete',
        context: 'any',
        description:
          'Allows delete action on any calendar resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Calendars',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_calendar',
        name: 'Restore Calendar',
        resource: 'calendar',
        action: 'update',
        context: 'any',
        description:
          'Allows update action on any calendar resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Calendars',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_calendar_year',
        name: 'Create Calendar Year',
        resource: 'calendaryear',
        action: 'create',
        context: 'any',
        description: 'Create calendar year',
        feature_id:
          features.find(
            (f) => f.name === 'Calendar Year',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_calendar_year',
        name: 'View Calendar Year',
        resource: 'calendaryear',
        action: 'read',
        context: 'any',
        description:
          'Allows read action on any calendaryear resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Calendar Year',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_calendar_year',
        name: 'Delete Calendar Year',
        resource: 'calendaryear',
        action: 'delete',
        context: 'any',
        description: 'Delete calendar year',
        feature_id:
          features.find(
            (f) => f.name === 'Calendar Year',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_calendar_year',
        name: 'Restore Calendar Year',
        resource: 'calendaryear',
        action: 'update',
        context: 'any',
        description: 'Restore calendar year',
        feature_id:
          features.find(
            (f) => f.name === 'Calendar Year',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_calendar_month',
        name: 'Create Calendar Month',
        resource: 'calendarmonth',
        action: 'create',
        context: 'any',
        description:
          'Allows create action on any calendarmonth resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Calendar Month',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_calendar_month',
        name: 'View Calendar Month',
        resource: 'calendarmonth',
        action: 'read',
        context: 'any',
        description:
          'Allows read action on any calendarmonth resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Calendar Month',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_calendar_month',
        name: 'Update Calendar Month',
        resource: 'calendarmonth',
        action: 'update',
        context: 'any',
        description:
          'Allows update action on any calendarmonth resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Calendar Month',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_calendar_month',
        name: 'Delete Calendar Month',
        resource: 'calendarmonth',
        action: 'delete',
        context: 'any',
        description:
          'Allows delete action on any calendarmonth resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Calendar Month',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_calendar_month',
        name: 'Restore Calendar Month',
        resource: 'calendarmonth',
        action: 'update',
        context: 'any',
        description:
          'Allows update action on any calendarmonth resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Calendar Month',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_attendance_planning',
        name: 'Create Attendance Planning',
        resource: 'attendanceplanning',
        action: 'create',
        context: 'any',
        description: 'Create attendance planning',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Attendance Planning',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_attendance_planning',
        name: 'View Attendance Planning',
        resource: 'attendanceplanning',
        action: 'read',
        context: 'any',
        description:
          'Allows read action on any attendanceplanning resource.',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Attendance Planning',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_attendance_planning',
        name: 'Update Attendance Planning',
        resource: 'attendanceplanning',
        action: 'update',
        context: 'any',
        description:
          'Allows update action on any attendanceplanning resource.',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Attendance Planning',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_attendance_planning',
        name: 'Delete Attendance Planning',
        resource: 'attendanceplanning',
        action: 'delete',
        context: 'any',
        description:
          'Allows delete action on any attendanceplanning resource.',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Attendance Planning',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_attendance_planning',
        name: 'Restore Attendance Planning',
        resource: 'attendanceplanning',
        action: 'update',
        context: 'any',
        description:
          'Allows update action on any attendanceplanning resource.',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Attendance Planning',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_attendance',
        name: 'Create Attendance',
        resource: 'attendance',
        action: 'create',
        context: 'any',
        description:
          'Allows create action on any attendance resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Attendance',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_attendance',
        name: 'View Attendance',
        resource: 'attendance',
        action: 'read',
        context: 'any',
        description:
          'Allows read action on any attendance resource.',
        feature_id:
          features.find(
            (f) => f.name === 'Attendance',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'sync_attendance',
        name: 'Sync Attendance',
        resource: 'attendance',
        action: 'read',
        context: 'any',
        description:
          'Sync attendance from device API',
        feature_id:
          features.find(
            (f) => f.name === 'Attendance',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_employee',
        name: 'Create Employee',
        resource: 'employee',
        action: 'create',
        context: 'any',
        description: 'Create a new employee',
        feature_id:
          features.find(
            (f) => f.name === 'Employee',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_employees',
        name: 'View Employees',
        resource: 'employees',
        action: 'read',
        context: 'any',
        description:
          'Get all employees (paginated & filtered)',
        feature_id:
          features.find(
            (f) => f.name === 'Employee',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'delete_employee',
        name: 'Delete Employee',
        resource: 'employee',
        action: 'delete',
        context: 'any',
        description: 'Soft delete employee',
        feature_id:
          features.find(
            (f) => f.name === 'Employee',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'restore_employee',
        name: 'Restore Employee',
        resource: 'employee',
        action: 'update',
        context: 'any',
        description:
          'Restore soft-deleted employee',
        feature_id:
          features.find(
            (f) => f.name === 'Employee',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'showroom_challan_create',
        name: 'Showroom Challan Create',
        resource: 'showroomgatepass',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: showroom_challan_create',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Showroom Gate Pass',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'branch_challan_dispatch',
        name: 'Showroom Challan Dispatch',
        resource: 'showroomgatepass',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: branch_challan_dispatch',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Showroom Gate Pass',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'showroom_challan_view',
        name: 'Showroom Challan View',
        resource: 'showroomgatepass',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: showroom_challan_view',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Showroom Gate Pass',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'showroom_challan_edit',
        name: 'Showroom Challan Edit',
        resource: 'showroomgatepass',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: showroom_challan_edit',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Showroom Gate Pass',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'showroom_challan_delete',
        name: 'Showroom Challan Delete',
        resource: 'showroomgatepass',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: showroom_challan_delete',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Showroom Gate Pass',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'showroom_challan_restore',
        name: 'Showroom Challan Restore',
        resource: 'showroomgatepass',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: showroom_challan_restore',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Showroom Gate Pass',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_gate_pass_create',
        name: 'Finishing Gate Pass Create',
        resource: 'finishinggatepass',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: finishing_gate_pass_create',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Finishing Gate Pass',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_gate_pass_view',
        name: 'Finishing Gate Pass View',
        resource: 'finishinggatepass',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: finishing_gate_pass_view',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Finishing Gate Pass',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_gate_pass_dispatch',
        name: 'Finishing Gate Pass Dispatch',
        resource: 'finishinggatepass',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: finishing_gate_pass_dispatch',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Finishing Gate Pass',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_gate_pass_edit',
        name: 'Finishing Gate Pass Edit',
        resource: 'finishinggatepass',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: finishing_gate_pass_edit',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Finishing Gate Pass',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_gate_pass_delete',
        name: 'Finishing Gate Pass Delete',
        resource: 'finishinggatepass',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: finishing_gate_pass_delete',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Finishing Gate Pass',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_gate_pass_restore',
        name: 'Finishing Gate Pass Restore',
        resource: 'finishinggatepass',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: finishing_gate_pass_restore',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Finishing Gate Pass',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_gate_pass_create',
        name: 'Distribution Gate Pass Create',
        resource: 'distributiongatepass',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: distribution_gate_pass_create',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Distribution Gate Pass',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_gate_pass_dispatch',
        name: 'Distribution Gate Pass Dispatch',
        resource: 'distributiongatepass',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: distribution_gate_pass_dispatch',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Distribution Gate Pass',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_gate_pass_view',
        name: 'Distribution Gate Pass View',
        resource: 'distributiongatepass',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: distribution_gate_pass_view',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Distribution Gate Pass',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_gate_pass_edit',
        name: 'Distribution Gate Pass Edit',
        resource: 'distributiongatepass',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: distribution_gate_pass_edit',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Distribution Gate Pass',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_gate_pass_delete',
        name: 'Distribution Gate Pass Delete',
        resource: 'distributiongatepass',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: distribution_gate_pass_delete',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Distribution Gate Pass',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_gate_pass_restore',
        name: 'Distribution Gate Pass Restore',
        resource: 'distributiongatepass',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: distribution_gate_pass_restore',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Distribution Gate Pass',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_challan_receive',
        name: 'Distribution Challan Receive',
        resource: 'showroomchallan',
        action: 'read',
        context: 'any',
        description:
          'Get pending return challans dropdown for showroom to distribution',
        feature_id:
          features.find(
            (f) => f.name === 'Showroom Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'showroom_return_claim',
        name: 'Warehosue Return Claim',
        resource: 'showroomchallan',
        action: 'read',
        context: 'any',
        description:
          'Create claim against showroom return challan on distribution (WAREHOSE_TO_DISTRIBUTION)',
        feature_id:
          features.find(
            (f) => f.name === 'Showroom Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'warehouse_claim',
        name: 'Warehouse Claim',
        resource: 'showroomchallan',
        action: 'read',
        context: 'any',
        description:
          'Create warehouse-side claim',
        feature_id:
          features.find(
            (f) => f.name === 'Showroom Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'branch_challan_receive',
        name: 'Branch Challan Receive',
        resource: 'showroomchallan',
        action: 'read',
        context: 'any',
        description:
          'Get pending challans dropdown for showroom to showroom transfer',
        feature_id:
          features.find(
            (f) => f.name === 'Showroom Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_challan_receive',
        name: 'Finishing Challan Receive',
        resource: 'finishingchallan',
        action: 'read',
        context: 'any',
        description:
          'Receive finishing transfer challan at receiving unit',
        feature_id:
          features.find(
            (f) => f.name === 'Finishing Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_challan_create',
        name: 'Finishing Challan Create',
        resource: 'finishingchallan',
        action: 'read',
        context: 'any',
        description: 'Create Finishing Challan',
        feature_id:
          features.find(
            (f) => f.name === 'Finishing Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_challan_view',
        name: 'Finishing Challan View',
        resource: 'finishingchallan',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: finishing_challan_view',
        feature_id:
          features.find(
            (f) => f.name === 'Finishing Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_challan_edit',
        name: 'Finishing Challan Edit',
        resource: 'finishingchallan',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: finishing_challan_edit',
        feature_id:
          features.find(
            (f) => f.name === 'Finishing Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_challan_delete',
        name: 'Finishing Challan Delete',
        resource: 'finishingchallan',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: finishing_challan_delete',
        feature_id:
          features.find(
            (f) => f.name === 'Finishing Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_challan_restore',
        name: 'Finishing Challan Restore',
        resource: 'finishingchallan',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: finishing_challan_restore',
        feature_id:
          features.find(
            (f) => f.name === 'Finishing Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_claim',
        name: 'Finishing Claim',
        resource: 'finishingchallan',
        action: 'read',
        context: 'any',
        description:
          'Create claim against finishing transfer challan by Finishing User',
        feature_id:
          features.find(
            (f) => f.name === 'Finishing Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_claim_resolve',
        name: 'Finishing Claim Resolve',
        resource: 'finishingchallan',
        action: 'read',
        context: 'any',
        description:
          'Resolve claim against finishing transfer challan by actual quantity',
        feature_id:
          features.find(
            (f) => f.name === 'Finishing Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_claim',
        name: 'Distribution Claim',
        resource: 'distributionchallan',
        action: 'read',
        context: 'any',
        description:
          'List finishing to distribution, distribution to distribution, and godown to distribution, Warehouse to Distribution claims',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Distribution Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_claim_resolve',
        name: 'Distribution Claim Resolve',
        resource: 'distributionchallan',
        action: 'read',
        context: 'any',
        description:
          'Resolve distribution-side claim, FINISHING_TO_DISTRIBUTION, DISTRIBUTION_TO_DISTRIBUTION,GODOWN_TO_DISTRIBUTION,BRANCH_TO_DISTRIBUTION',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Distribution Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'finishing_return_claim',
        name: 'Finishing Return Claim',
        resource: 'distributionchallan',
        action: 'read',
        context: 'any',
        description:
          'Create a claim against a distribution challan',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Distribution Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_challan_create',
        name: 'Distribution Challan Create',
        resource: 'distributionchallan',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: distribution_challan_create',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Distribution Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_challan_view',
        name: 'Distribution Challan View',
        resource: 'distributionchallan',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: distribution_challan_view',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Distribution Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_challan_edit',
        name: 'Distribution Challan Edit',
        resource: 'distributionchallan',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: distribution_challan_edit',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Distribution Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_challan_delete',
        name: 'Distribution Challan Delete',
        resource: 'distributionchallan',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: distribution_challan_delete',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Distribution Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_challan_restore',
        name: 'Distribution Challan Restore',
        resource: 'distributionchallan',
        action: 'read',
        context: 'any',
        description:
          'Legacy permission: distribution_challan_restore',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Distribution Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'distribution_transfer_receive',
        name: 'Distribution Transfer Receive',
        resource: 'distributionchallan',
        action: 'read',
        context: 'any',
        description:
          'Get pending challans dropdown for distribution to distribution transfer',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Distribution Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'godown_challan_receive',
        name: 'Godown Challan Receive',
        resource: 'distributionchallan',
        action: 'read',
        context: 'any',
        description:
          'Get pending challans dropdown for godown receive',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Distribution Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'godown_claim',
        name: 'Godown Claim',
        resource: 'distributionchallan',
        action: 'read',
        context: 'any',
        description:
          'List claims against distribution to godown and godown to godown challans',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Distribution Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'godown_claim_resolve',
        name: 'Godown Claim Resolve',
        resource: 'distributionchallan',
        action: 'read',
        context: 'any',
        description:
          'Resolve claim against distribution to godown or godown to godown challan by actual quantity',
        feature_id:
          features.find(
            (f) =>
              f.name === 'Distribution Challan',
          )?.id || null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const tableName = 'sys_permissions';
    const uniqueKey = 'key';
    await intelligentUpsert(
      queryInterface,
      tableName,
      permissionsData,
      uniqueKey,
    );
  },

  async down(queryInterface) {
    const permissionKeys = [
      'create_showroom',
      'view_showrooms',
      'view_showroom',
      'update_showroom',
      'delete_showroom',
      'restore_showroom',
      'create_vehicle',
      'list_vehicle',
      'read_vehicle',
      'update_vehicle',
      'delete_vehicle',
      'force_delete_vehicle',
      'restore_vehicle',
      'create_uom',
      'list_uom',
      'read_uom',
      'update_uom',
      'delete_uom',
      'force_delete_uom',
      'restore_uom',
      'create_office_type',
      'list_office_type',
      'read_office_type',
      'update_office_type',
      'delete_office_type',
      'create_office',
      'list_office',
      'read_office',
      'update_office',
      'delete_office',
      'create_floor',
      'list_floor',
      'read_floor',
      'update_floor',
      'delete_floor',
      'create_factory_unit',
      'view_factory_units',
      'view_factory_unit',
      'update_factory_unit',
      'delete_factory_unit',
      'create_section',
      'view_sections',
      'view_section',
      'update_section',
      'delete_section',
      'create_factory',
      'view_factories',
      'view_factory',
      'update_factory',
      'delete_factory',
      'view_divisions',
      'view_division',
      'create_company',
      'view_companies',
      'view_company',
      'update_company',
      'delete_company',
      'create_showroom_bank_diposit',
      'list_showroom_bank_diposit',
      'view_showroom_bank_diposit',
      'update_showroom_bank_diposit',
      'delete_showroom_bank_diposit',
      'force_delete_showroom_bank_diposit',
      'restore_showroom_bank_diposit',
      'create_promotion',
      'list_promotions',
      'view_promotion',
      'update_promotion',
      'delete_promotion',
      'bulk_update_promotions',
      'bulk_delete_promotions',
      'create_promotion_category',
      'list_promotion_categories',
      'view_promotion_category',
      'update_promotion_category',
      'delete_promotion_category',
      'view_sales',
      'view_sale',
      'create_pos_price_declaration',
      'list_pos_price_declaration',
      'list_barcode_dropdown',
      'available-sizes',
      'read_pos_price_declaration',
      'update_pos_price_declaration',
      'delete_pos_price_declaration',
      'restore_pos_price_declaration',
      'create_pay_scale',
      'view_pay_scales',
      'view_pay_scale',
      'update_pay_scale',
      'delete_pay_scale',
      'restore_pay_scale',
      'create_godown',
      'view_godowns',
      'view_godown',
      'update_godown',
      'delete_godown',
      'restore_godown',
      'create_distribution',
      'view_distributions',
      'view_distribution',
      'update_distribution',
      'delete_distribution',
      'restore_distribution',
      'create_designation',
      'view_designations',
      'view_designation',
      'update_designation',
      'delete_designation',
      'restore_designation',
      'create_department',
      'view_departments',
      'view_department',
      'update_department',
      'delete_department',
      'restore_department',
      'create_customer',
      'view_customers',
      'update_customer',
      'delete_customer',
      'create_country',
      'view_countries',
      'view_country',
      'update_country',
      'update_countries',
      'restore_country',
      'soft_delete_country',
      'delete_country',
      'create_brand',
      'view_brands',
      'view_brand',
      'update_brand',
      'restore_brand',
      'soft_delete_brand',
      'create_showroom_counter',
      'list_showroom_counter',
      'view_showroom_counter',
      'update_showroom_counter',
      'delete_showroom_counter',
      'force_delete_showroom_counter',
      'restore_showroom_counter',
      'view_sales_returns',
      'manage_operation_summary',
      'branch_stock_view',
      'transit_stock_view',
      'finishing_packaging_create',
      'finishing_packaging_view',
      'finishing_packaging_edit',
      'distribution_packaging_create',
      'distribution_packaging_view',
      'distribution_packaging_edit',
      'branch_packaging_create',
      'branch_packaging_view',
      'branch_packaging_edit',
      'finishing_packaging_delete',
      'distribution_packaging_delete',
      'branch_packaging_delete',
      'import_bill_create',
      'finishing_stock_log_view',
      'finishing_stock_report',
      'import_bill_view',
      'finishing_stock_adjustment',
      'distribution_stock_view',
      'create_style',
      'view_styles',
      'view_style',
      'update_style',
      'delete_style',
      'create_size',
      'view_sizes',
      'view_size',
      'update_size',
      'delete_size',
      'create_color',
      'view_colors',
      'view_color',
      'update_color',
      'delete_color',
      'create_pos_product',
      'view_pos_products',
      'view_pos_product',
      'update_pos_product',
      'update_pos_product_pricing',
      'create_category_size',
      'view_category_sizes',
      'view_category_size',
      'reorder_category_size',
      'update_category_size',
      'delete_category_size',
      'create_category',
      'view_categories',
      'view_banks',
      'view_category',
      'update_category',
      'delete_category',
      'create_shift',
      'view_shifts',
      'view_shift',
      'update_shift',
      'delete_shift',
      'restore_shift',
      'create_weekly_holiday',
      'list_weekly_holiday',
      'read_weekly_holiday',
      'update_weekly_holiday',
      'delete_weekly_holiday',
      'create_sub_department',
      'list_sub_department',
      'read_sub_department',
      'update_sub_department',
      'delete_sub_department',
      'create_salary_grade',
      'view_salary_grade',
      'update_salary_grade',
      'delete_salary_grade',
      'restore_salary_grade',
      'create_office_time',
      'list_office_time',
      'read_office_time',
      'update_office_time',
      'delete_office_time',
      'create_shift_group',
      'view_shift_groups',
      'view_shift_group',
      'update_shift_group',
      'delete_shift_group',
      'restore_shift_group',
      'create_hrm_schedule',
      'view_hrm_schedule',
      'update_hrm_schedule',
      'delete_hrm_schedule',
      'restore_hrm_schedule',
      'create_salary_head',
      'view_salary_heads',
      'view_salary_head',
      'update_salary_head',
      'delete_salary_head',
      'restore_salary_head',
      'create_salary_component',
      'list_salary_component',
      'read_salary_component',
      'update_salary_component',
      'delete_salary_component',
      'restore_salary_component',
      'create_overtime_break',
      'view_overtime_breaks',
      'view_overtime_break',
      'update_overtime_break',
      'delete_overtime_break',
      'restore_overtime_break',
      'create_offday_attendance',
      'list_offday_attendance',
      'read_offday_attendance',
      'update_offday_attendance',
      'delete_offday_attendance',
      'restore_offday_attendance',
      'create_leave_type',
      'view_leave_type',
      'update_leave_type',
      'delete_leave_type',
      'restore_leave_type',
      'create_leave_application',
      'approve_leave_application',
      'reject_leave_application',
      'view_leave_application',
      'update_leave_application',
      'delete_leave_application',
      'restore_leave_application',
      'create_holiday_config',
      'view_holiday_config',
      'update_holiday_config',
      'delete_holiday_config',
      'restore_holiday_config',
      'view_employee',
      'update_employee',
      'create_calendar',
      'view_calendar',
      'update_calendar',
      'delete_calendar',
      'restore_calendar',
      'create_calendar_year',
      'view_calendar_year',
      'delete_calendar_year',
      'restore_calendar_year',
      'create_calendar_month',
      'view_calendar_month',
      'update_calendar_month',
      'delete_calendar_month',
      'restore_calendar_month',
      'create_attendance_planning',
      'view_attendance_planning',
      'update_attendance_planning',
      'delete_attendance_planning',
      'restore_attendance_planning',
      'create_attendance',
      'view_attendance',
      'sync_attendance',
      'create_employee',
      'view_employees',
      'delete_employee',
      'restore_employee',
      'showroom_challan_create',
      'branch_challan_dispatch',
      'showroom_challan_view',
      'showroom_challan_edit',
      'showroom_challan_delete',
      'showroom_challan_restore',
      'finishing_gate_pass_create',
      'finishing_gate_pass_view',
      'finishing_gate_pass_dispatch',
      'finishing_gate_pass_edit',
      'finishing_gate_pass_delete',
      'finishing_gate_pass_restore',
      'distribution_gate_pass_create',
      'distribution_gate_pass_dispatch',
      'distribution_gate_pass_view',
      'distribution_gate_pass_edit',
      'distribution_gate_pass_delete',
      'distribution_gate_pass_restore',
      'distribution_challan_receive',
      'branch_return_claim',
      'branch_claim',
      'branch_challan_receive',
      'finishing_challan_receive',
      'finishing_challan_create',
      'finishing_challan_view',
      'finishing_challan_edit',
      'finishing_challan_delete',
      'finishing_challan_restore',
      'finishing_claim',
      'finishing_claim_resolve',
      'distribution_claim',
      'distribution_claim_resolve',
      'finishing_return_claim',
      'distribution_challan_create',
      'distribution_challan_view',
      'distribution_challan_edit',
      'distribution_challan_delete',
      'distribution_challan_restore',
      'distribution_transfer_receive',
      'godown_challan_receive',
      'godown_claim',
      'godown_claim_resolve',
    ];
    await queryInterface.bulkDelete(
      'sys_permissions',
      { key: permissionKeys },
    );
  },
};
