import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { FundingRequest } from './fundingRequest';

@Table
export class FundingBudget extends Model<FundingBudget> {
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
  budgetTitle!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  fundingBudgetDescription!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "Activo",
  })
  status!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 0,
    },
  })
  totalBudget!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  usedBudget!: number;

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

  @HasMany(() => FundingRequest, {
    foreignKey: 'fundingBudgetId',
  })
  fundings?: FundingRequest[];
}
