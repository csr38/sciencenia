import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.addColumn('Files', 'createdAt', {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),
  });

  await queryInterface.addColumn('Files', 'updatedAt', {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),
  });

  await queryInterface.addColumn('ScholarshipFiles', 'createdAt', {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),
  });

  await queryInterface.addColumn('ScholarshipFiles', 'updatedAt', {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),
  });

  await queryInterface.addColumn('FundingRequestFiles', 'createdAt', {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),
  });

  await queryInterface.addColumn('FundingRequestFiles', 'updatedAt', {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(),
  });
};
