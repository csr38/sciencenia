import { QueryInterface, DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  console.log('Creando tabla "UserResearcher"');

  await queryInterface.createTable('UserResearchers', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    researcher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Researchers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    tutorRol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  console.log('Tabla "UserResearcher" creada');
};

export const down = async ({ context: queryInterface }: { context: QueryInterface }) => {
  console.log('Eliminando tabla "UserResearcher"');

  await queryInterface.dropTable('UserResearcher');

  console.log('Tabla "UserResearcher" eliminada');
};