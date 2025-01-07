import { QueryInterface } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.changeColumn('Users', 'roleId', {
    type: 'INTEGER',
    allowNull: false,
    defaultValue: 2,
  });
};