import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.bulkDelete('Scholarships', {
    applicationPeriodId: null,
  });
  await queryInterface.changeColumn('Scholarships', 'applicationPeriodId', {
    type: DataTypes.INTEGER,
    allowNull: false,
  });
};