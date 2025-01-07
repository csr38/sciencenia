import { QueryInterface } from 'sequelize';
import { DataType } from 'sequelize-typescript';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.addColumn('Users', 'firebaseToken', {
    type: DataType.STRING,
    allowNull: true,
  });
};

export const down = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.removeColumn('Users', 'firebaseToken');
};