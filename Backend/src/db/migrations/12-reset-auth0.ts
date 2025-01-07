import { QueryInterface } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.bulkUpdate('Users', { auth0Id: null }, {});
};
