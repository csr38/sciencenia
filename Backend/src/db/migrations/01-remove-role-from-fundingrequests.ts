import { QueryInterface, DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  console.log('Eliminando columna "role" de "FundingRequests"');
  await queryInterface.removeColumn('FundingRequests', 'role');
};

export const down = async ({ context: queryInterface }: { context: QueryInterface }) => {
  console.log('Restaurando columna "role" en "FundingRequests"');
  await queryInterface.addColumn('FundingRequests', 'role', {
    type: DataTypes.STRING,
  });
};