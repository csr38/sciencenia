import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {

    const tableDefinition = await queryInterface.describeTable('ApplicationPeriods');
    const tableDefinitionScholarship = await queryInterface.describeTable('Scholarships');
    if (!tableDefinition.totalBudget) {
        await queryInterface.addColumn('ApplicationPeriods', 'totalBudget', {
            type: DataTypes.JSONB,
            allowNull: false,
        });
    }

    if (!tableDefinition.usedBudget) {
        await queryInterface.addColumn('ApplicationPeriods', 'usedBudget', {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: { BachelorDegree: 0, MasterDegree: 0, Doctorate: 0 },
        });
    }

    if (!tableDefinitionScholarship.amountGranted) {
        await queryInterface.addColumn('Scholarships', 'amountGranted', {
            type: DataTypes.FLOAT,
            allowNull: true,
            defaultValue: 0
        });
    }
    
    if (!tableDefinitionScholarship.response) {
        await queryInterface.addColumn('Scholarships', 'response', {
            type: DataTypes.TEXT,
            allowNull: true,
        });
    }
};
