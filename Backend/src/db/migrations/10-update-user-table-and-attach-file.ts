import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {

    const tableDefinition = await queryInterface.describeTable('Users');

    if (tableDefinition.tutorName) {
        await queryInterface.removeColumn('Users', 'tutorName');
    }

    if (tableDefinition.tutorEmail) {
        await queryInterface.removeColumn('Users', 'tutorEmail');
    }

    if (!tableDefinition.fileId) {
        await queryInterface.addColumn('Users', 'fileId', {
            type: DataTypes.INTEGER,
            references: {
                model: 'Files',
                key: 'id',
            },
            allowNull: true,
        });
    }
};
