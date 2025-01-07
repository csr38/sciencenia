import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  
  await queryInterface.createTable('Files', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  await queryInterface.createTable('ScholarshipFiles', {
    scholarshipId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Scholarships',
        key: 'id',
      },
      allowNull: false,
    },
    fileId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Files',
        key: 'id',
      },
      allowNull: false,
    },
  });

  await queryInterface.createTable('FundingRequestFiles', {
    fundingRequestId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'FundingRequests',
        key: 'id',
      },
      allowNull: false,
    },
    fileId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Files',
        key: 'id',
      },
      allowNull: false,
    },
  });

};

