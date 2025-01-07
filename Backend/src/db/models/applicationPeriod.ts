import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Scholarship } from './scholarship';

@Table
export class ApplicationPeriod extends Model<ApplicationPeriod> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  })
  periodTitle!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  periodDescription!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "Activo",
  })
  statusApplication!: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: { BachelorDegree: 10000000, MasterDegree: 10000000, Doctorate: 10000000 },
  })
  totalBudget!: Record<string, number>;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: { BachelorDegree: 0, MasterDegree: 0, Doctorate: 0 },
  })
  usedBudget!: Record<string, number>;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    validate: {
      isAfterStartDate(value: Date) {
        if (value < this.startDate) {
          throw new Error('End date must be after start date');
        }
      },
    },
  })
  endDate!: Date;

  @HasMany(() => Scholarship, {
    foreignKey: 'applicationPeriodId',
  })
  scholarships?: Scholarship[];
}
