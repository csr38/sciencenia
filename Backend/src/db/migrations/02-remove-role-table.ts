import { QueryInterface } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  // Rename the existing column to preserve data
  await queryInterface.renameColumn('Users', 'roleId', 'roleId_temp');
  
  // Add the new column
  await queryInterface.addColumn('Users', 'roleId', {
    type: 'INTEGER',
    allowNull: true,
  });
  
  // Copy data from the old column to the new column
  await queryInterface.sequelize.query(`
    UPDATE "Users"
    SET "roleId" = "roleId_temp"
    `);
    
  // Remove the temporary column
  await queryInterface.removeColumn('Users', 'roleId_temp');

  await queryInterface.dropTable('Roles');
};