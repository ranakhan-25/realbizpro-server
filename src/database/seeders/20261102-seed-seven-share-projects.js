'use strict';

const argon2 = require('argon2');
const { randomUUID } = require('crypto');

module.exports = {
  async up(queryInterface, Sequelize) {
    const ownerEmail = 'owner@shareproject.com';
    const [owners] = await queryInterface.sequelize.query(
      'SELECT id FROM share_users WHERE email = :email LIMIT 1',
      { replacements: { email: ownerEmail } },
    );

    let ownerId;
    if (owners.length) {
      ownerId = owners[0].id;
    } else {
      const passwordHash = await argon2.hash('12345678');
      await queryInterface.bulkInsert('share_users', [{
        uuid: randomUUID(),
        name: 'Share Project Demo Owner',
        email: ownerEmail,
        phone: '01700000001',
        password_hash: passwordHash,
        role: 'project-owner',
        status: 'active',
        email_verified: true,
        created_at: new Date(),
        updated_at: new Date(),
      }]);
      const [created] = await queryInterface.sequelize.query(
        'SELECT id FROM share_users WHERE email = :email LIMIT 1',
        { replacements: { email: ownerEmail } },
      );
      ownerId = created[0].id;
    }

    const categories = [
      ['HOTEL_RESORT', 'Hotel & Resort'],
      ['COMMERCIAL_REAL_ESTATE', 'Commercial Real Estate'],
      ['RENEWABLE_ENERGY', 'Renewable Energy'],
      ['TRANSPORT', 'Transport'],
      ['TECHNOLOGY', 'Technology'],
    ];
    const categoryIds = {};
    for (const [code, name] of categories) {
      const [rows] = await queryInterface.sequelize.query(
        'SELECT id FROM share_project_categories WHERE code = :code LIMIT 1',
        { replacements: { code } },
      );
      if (rows.length) categoryIds[code] = rows[0].id;
      else {
        await queryInterface.bulkInsert('share_project_categories', [{
          uuid: randomUUID(), code, name, is_active: true, created_at: new Date(), updated_at: new Date(),
        }]);
        const [created] = await queryInterface.sequelize.query(
          'SELECT id FROM share_project_categories WHERE code = :code LIMIT 1',
          { replacements: { code } },
        );
        categoryIds[code] = created[0].id;
      }
    }

    const projects = [
      ['Sea View Eco Resort', 'HOTEL_RESORT', 'Cox Bazar, Bangladesh', 'Premium eco-friendly resort investment.', 35000000, 1000, 35000, 70000, 15],
      ['Lakeview Commercial Plaza', 'COMMERCIAL_REAL_ESTATE', 'Uttara, Dhaka', 'Modern commercial plaza with long-term tenant demand.', 21600000, 1200, 18000, 36000, 13],
      ['Green Solar Farm', 'RENEWABLE_ENERGY', 'Savar, Dhaka', 'Grid-connected solar energy generation project.', 17600000, 800, 22000, 44000, 18],
      ['Premium Urban Mobility', 'TRANSPORT', 'Banani, Dhaka', 'Commercial vehicle investment and fleet network.', 7200000, 600, 12000, 24000, 11],
      ['Smart Agriculture Hub', 'TECHNOLOGY', 'Gazipur, Bangladesh', 'Technology-enabled agricultural production and storage.', 12000000, 750, 16000, 32000, 16],
      ['Riverfront Business Center', 'COMMERCIAL_REAL_ESTATE', 'Chattogram, Bangladesh', 'Riverfront mixed-use business investment center.', 28400000, 1400, 20286, 40572, 14],
      ['Clean Energy Storage Park', 'RENEWABLE_ENERGY', 'Sylhet, Bangladesh', 'Battery storage and clean energy infrastructure.', 19800000, 900, 22000, 44000, 17],
    ];

    for (const [name, categoryCode, location, description, amount, shares, price, minimum, annualReturn] of projects) {
      const [exists] = await queryInterface.sequelize.query(
        'SELECT uuid FROM share_projects WHERE name = :name LIMIT 1',
        { replacements: { name } },
      );
      if (exists.length) continue;
      await queryInterface.bulkInsert('share_projects', [{
        uuid: randomUUID(),
        owner_id: ownerId,
        category_id: categoryIds[categoryCode],
        name,
        description,
        location,
        thumbnail_url: null,
        total_investment_amount: amount,
        total_shares: shares,
        price_per_share: price,
        minimum_investment: minimum,
        expected_annual_return: annualReturn,
        start_date: '2026-01-01',
        end_date: '2031-12-31',
        status: 'published',
        rejection_reason: null,
        submitted_at: new Date(),
        published_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      }]);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('share_projects', {
      name: [
        'Sea View Eco Resort',
        'Lakeview Commercial Plaza',
        'Green Solar Farm',
        'Premium Urban Mobility',
        'Smart Agriculture Hub',
        'Riverfront Business Center',
        'Clean Energy Storage Park',
      ],
    });
  },
};
