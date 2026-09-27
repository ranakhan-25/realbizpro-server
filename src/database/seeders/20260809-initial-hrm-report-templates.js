'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const templates = [
      {
        uuid: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
        template_type: 'APPOINTMENT_LETTER',
        template_name: 'Standard Appointment Letter',
        subject: 'Letter of Appointment',
        content: '<p>Dear #EmployeeName,</p><p>We are pleased to offer you the position of #DesignationName at #CompanyName.</p>',
        status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: 'b2c3d4e5-f678-9012-3456-789abcdef012',
        template_type: 'INCREMENT_LETTER',
        template_name: 'Standard Increment Letter',
        subject: 'Salary Increment Letter',
        content: '<p>Dear #EmployeeName,</p><p>Your salary has been incremented successfully.</p>',
        status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ];

    await queryInterface.bulkInsert('hrm_report_templates', templates, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('hrm_report_templates', null, {});
  },
};
