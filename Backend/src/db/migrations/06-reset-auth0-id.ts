import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {

  await queryInterface.removeColumn('Users', 'auth0Id');

  await queryInterface.addColumn('Users', 'auth0Id', {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  });
};

