import { Table, Column, Model, DataType, ForeignKey, BelongsTo, 
  BelongsToMany, DefaultScope} from 'sequelize-typescript';
import { User } from './user';
import { File } from './file';
import { FundingRequestFiles } from './fundingRequestFiles';
import { FundingBudget } from './fundingBudget';

@DefaultScope(() => ({
  include: [
    { model: User, as: 'applicant' },
    { 
      model: File,
      as: 'files', 
      attributes: ['id', 'fileName', 'mimeType', 'url', 'size'],
      through: { attributes: [] },
    },
  ],
}))
@Table
export class FundingRequest extends Model<FundingRequest> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  purpose!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  otherPurpose?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  tasksToDo?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  resultingWork?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  destination!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  durationPeriod!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  financingType!: string[];

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate : {
      isInt: true,
      min: 0
    }
  })
  amountRequested?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      isInt: true,
      min: 0
    }
  })
  amountGranted?: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  otherFinancingType?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  outsideFinancing!: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  outsideFinancingSponsors?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'No Aplica',
  })
  conferenceName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'No Aplica',
  })
  conferenceRanking!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'No Aplica',
  })
  researchName!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    defaultValue: 'No Aplica',
  })
  researchAbstract!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'No Aplica',
  })
  acknowledgment!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  acknowledgmentProof?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'No Aplica',
  })
  outsideAcknowledgment!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    defaultValue: null,
  })
  outsideAcknowledgmentName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'No Aplica',
  })
  participationType!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'Pendiente',
  })
  status!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  response: string;

  @ForeignKey(() => User)
  @Column
  applicantId: number;

  @BelongsTo(() => User, 'applicantId')
  applicant: ReturnType<() => User>; // https://github.com/sequelize/sequelize-typescript/issues/825#issuecomment-1147027162

  @BelongsToMany(() => File, () => FundingRequestFiles)
  files?: File[];

  @ForeignKey(() => FundingBudget)
  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  fundingBudgetId?: number;

  @BelongsTo(() => FundingBudget, 'fundingBudgetId')
  budget?: FundingBudget;

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