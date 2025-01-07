import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  await queryInterface.dropTable('Research');
  await queryInterface.createTable('Research', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    doi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    authors: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    journal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    volume: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    yearPublished: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    firstPage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastPage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    indexed: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    funding: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    researchLines: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    progressReport: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ceniaParticipants: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: false,
    },
    roleParticipations: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    anidNotes: {
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
};