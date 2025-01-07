import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {

    const tableDefinition = await queryInterface.describeTable('FundingRequests');
    if (!tableDefinition.amountRequested) {
        await queryInterface.addColumn('FundingRequests', 'amountRequested', {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: true,
                min: 0,
            }
        });
    }

    if (!tableDefinition.amountGranted) {
        await queryInterface.addColumn('FundingRequests', 'amountGranted', {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
            validate: {
                isInt: true,
                min: 0
            }
        });
    }

    if (!tableDefinition.fundingBudgetId) {
        await queryInterface.addColumn('FundingRequests', 'fundingBudgetId', {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'FundingBudgets',
                key: 'id'
            }
        });
    }

};
