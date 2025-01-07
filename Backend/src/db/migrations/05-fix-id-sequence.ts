import { QueryInterface } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  // List of tables and their corresponding sequences
  const tables = [
    { table: 'Users', sequence: 'Users_id_seq' },
    { table: 'Theses', sequence: 'Theses_id_seq' },
    { table: 'Scholarships', sequence: 'Scholarships_id_seq' },
    { table: 'FundingRequests', sequence: 'FundingRequests_id_seq' },
    { table: 'ApplicationPeriods', sequence: 'ApplicationPeriods_id_seq' }
  ];

  for (const { table, sequence } of tables) {
    // Step 1: Find the maximum current ID value from the table
    const [result] = await queryInterface.sequelize.query(`
        SELECT COALESCE(MAX(id), 0) as "maxId" FROM "${table}";
    `);

    // Type assertion to specify the expected structure of the result
    const [{ maxId }] = result as [{ maxId: number }];
    console.log(`Max ID for ${table}: ${maxId}`);

    // Step 2: Reset the sequence based on the highest ID value
    if (maxId) {
      await queryInterface.sequelize.query(`
        ALTER SEQUENCE "${sequence}" RESTART WITH ${maxId + 1};
      `);
    } else {
      // If the table is empty, reset to start at 1
      await queryInterface.sequelize.query(`
        ALTER SEQUENCE "${sequence}" RESTART WITH 1;
      `);
    }
  }
};

