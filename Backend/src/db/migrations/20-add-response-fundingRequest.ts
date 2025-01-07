import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {

    const tableDefinition = await queryInterface.describeTable('FundingRequests');
    if (!tableDefinition.response) {
        await queryInterface.addColumn('FundingRequests', 'response', {
            type: DataTypes.TEXT,
            allowNull: true,
            });
    }
};

export const down = async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.removeColumn('FundingRequests', 'response');
};