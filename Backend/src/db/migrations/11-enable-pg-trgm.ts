import { QueryInterface } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.sequelize.query(`
        CREATE EXTENSION IF NOT EXISTS pg_trgm;
    `);
}