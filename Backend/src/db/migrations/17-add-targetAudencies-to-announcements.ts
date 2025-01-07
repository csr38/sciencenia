import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.addColumn('Announcements', 'targetAudiences', {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
    });
};

export const down = async ({ context: queryInterface }: { context: QueryInterface }) => {
    await queryInterface.removeColumn('Announcements', 'targetAudiences');
};
