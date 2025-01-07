import { QueryInterface, DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: { context: QueryInterface }) => {
  // Create Role Table
  await queryInterface.createTable('Roles', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    accountScope: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // Create User Table
  await queryInterface.createTable('Users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    auth0Id: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Password',
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    rut: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    tutorName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tutorEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    names: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    secondLastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    academicDegree: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    institution: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fullNameDegree: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    entryYear: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    researchLines: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Roles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // Create ApplicationPeriod Table
  await queryInterface.createTable('ApplicationPeriods', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    periodTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    periodDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    statusApplication: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Activo',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // Create FundingRequest Table
  await queryInterface.createTable('FundingRequests', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    purpose: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otherPurpose: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    tasksToDo: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    resultingWork: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    durationPeriod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    financingType: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    otherFinancingType: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    outsideFinancing: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    outsideFinancingSponsors: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    conferenceName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'No Aplica',
    },
    conferenceRanking: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'No Aplica',
    },
    researchName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'No Aplica',
    },
    researchAbstract: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'No Aplica',
    },
    acknowledgment: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'No Aplica',
    },
    acknowledgmentProof: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    outsideAcknowledgment: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'No Aplica',
    },
    outsideAcknowledgmentName: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    participationType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'No Aplica',
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Pendiente',
    },
    applicantId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // Create Research Table
  await queryInterface.createTable('Researches', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    doi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    month: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    author: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    firstPage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    lastPage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    conference: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    magazine: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    totalReferences: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pdf: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // Create Scholarship Table
  await queryInterface.createTable('Scholarships', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Pendiente',
    },
    statusTutor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Pendiente',
    },
    tutorResponse: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    graduationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    scientificProduction: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    otherCentersAffiliation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otherProgramsFunding: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    anidScholarshipApplication: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    nonAnidScholarshipJustification: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ceniaParticipationActivities: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bankAccountType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bankAccountNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amountRequested: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    applicationPeriodId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'ApplicationPeriods',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // Create Thesis Table
  await queryInterface.createTable('Theses', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    extension: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    resourcesRequested: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  // Create UserResearch Table (pivot table)
  await queryInterface.createTable('UserResearches', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    researchId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Researches',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};

export const down = async ({ context: queryInterface }: { context: QueryInterface }) => {
  // Drop tables in reverse order of creation
  await queryInterface.dropTable('UserResearches');
  await queryInterface.dropTable('Users');
  await queryInterface.dropTable('Theses');
  await queryInterface.dropTable('Scholarships');
  await queryInterface.dropTable('Roles');
  await queryInterface.dropTable('Researches');
  await queryInterface.dropTable('FundingRequests');
  await queryInterface.dropTable('ApplicationPeriods');
};
