const { isEqual, pick } = require('lodash');

/**
 * A helper function to perform "upsert" operations for seeding.
 * It can check for existence based on a single unique key or a composite key.
 *
 * @param {import('sequelize').QueryInterface} queryInterface - The Sequelize query interface.
 * @param {string} tableName - The name of the table to seed.
 * @param {any[]} data - An array of data objects to seed.
 * @param {string|string[]} uniqueKey - The property name(s) to use for checking existence.
 */
const intelligentUpsert = async (
  queryInterface,
  tableName,
  data,
  uniqueKey,
) => {
  const uniqueKeys = Array.isArray(uniqueKey)
    ? uniqueKey
    : [uniqueKey];

  for (const item of data) {
    const whereClause = uniqueKeys
      .map((key) => `"${key}" = :${key}`)
      .join(' AND ');
    const replacements = pick(item, uniqueKeys);

    const existing =
      await queryInterface.sequelize.query(
        `SELECT * FROM "${tableName}" WHERE ${whereClause}`,
        {
          replacements,
          type: 'SELECT',
          plain: true,
        },
      );

    if (existing) {
      // We don't update existing permissions to preserve manual changes (like description)
      console.log(
        `[${tableName}] Record for ${JSON.stringify(replacements)} already exists. Skipping.`,
      );
    } else {
      console.log(
        `[${tableName}] Creating new record for ${JSON.stringify(replacements)}`,
      );
      await queryInterface.bulkInsert(tableName, [
        item,
      ]);
    }
  }
};

module.exports = { intelligentUpsert };
