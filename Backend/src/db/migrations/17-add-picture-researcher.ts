import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {

    await queryInterface.addColumn('Researchers', 'fileId', {
        type: DataTypes.INTEGER,
        references: {
            model: 'Files',
            key: 'id',
        },
        allowNull: true,
    });
};
