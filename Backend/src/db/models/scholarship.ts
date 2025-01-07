import { Table, Column, Model, DataType, BelongsTo, ForeignKey, 
  BelongsToMany, 
  DefaultScope} from 'sequelize-typescript';
import { ApplicationPeriod } from './applicationPeriod';
import { User } from './user';
import { File } from './file';
import { ScholarshipFiles } from './scholarshipFiles';

@DefaultScope(() => ({
  include: [
    { model: User, as: 'student' },
    { model: ApplicationPeriod, as: 'applicationPeriod' },
    { 
      model: File,
      as: 'files', 
      attributes: ['id', 'fileName', 'mimeType', 'url', 'size'],
      through: { attributes: [] },
    },
  ],
}))
@Table({
  indexes: [
    {
      unique: true,
      fields: ['studentId', 'applicationPeriodId']
    }
  ]
})
export class Scholarship extends Model<Scholarship> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'Pendiente',
    validate: {
      notEmpty: true,
    }
  })
  status!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'Pendiente',
    validate: {
      notEmpty: true,
    }
  })
  statusTutor!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  tutorResponse?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  graduationDate!: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  })
  scientificProduction!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  otherCentersAffiliation?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  otherProgramsFunding?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  anidScholarshipApplication!: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  nonAnidScholarshipJustification?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  })
  ceniaParticipationActivities!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  bankName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  bankAccountType?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      is: /^[0-9\s-]+$/, // Only numbers, spaces and hyphens
    }
  })
  bankAccountNumber?: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    validate: {
      isFloat: true,
      min: 0,
    }
  })
  amountRequested?: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0,
  })
  amountGranted?: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  response: string;

  @ForeignKey(() => User)
  @Column
  studentId: number;

  @BelongsTo(() => User, 'studentId')
  student: ReturnType<() => User>;

  @ForeignKey(() => ApplicationPeriod)
  @Column({
    allowNull: false,
  })
  applicationPeriodId!: number;

  @BelongsTo(() => ApplicationPeriod, 'applicationPeriodId')
  applicationPeriod?: ReturnType<() => ApplicationPeriod>; // https://github.com/sequelize/sequelize-typescript/issues/825#issuecomment-1147027162

  @BelongsToMany(() => File, () => ScholarshipFiles)
  files?: File[];

  validateFiles(files: File[]): boolean {
    if (files.length > 10) {
      throw new Error('You cannot upload more than 10 files');
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) { // 5 MB
        throw new Error(`File ${file.fileName} exceeds the 5MB limit`);
      }
    }

    return true;
  }
}