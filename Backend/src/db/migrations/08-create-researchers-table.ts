import { QueryInterface, DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  console.log('Creando tabla "researchers"');

  await queryInterface.createTable('Researchers', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    names: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secondLastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rut: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    charge: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    researchLines: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    highestTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    highestDegree: {
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

  console.log('Tabla "researchers" creada');
};

export const down = async ({ context: queryInterface }: { context: QueryInterface }) => {
  console.log('Eliminando tabla "researchers"');

  await queryInterface.dropTable('researchers');

  console.log('Tabla "researchers" eliminada');
};