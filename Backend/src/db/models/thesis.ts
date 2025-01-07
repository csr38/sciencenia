import { Table, Column, Model, DataType, ForeignKey, BelongsTo, DefaultScope } from 'sequelize-typescript';
import { User } from './user';
@DefaultScope(() => ({
  include: [
    { model: User, as: 'user' },
  ],
}))
@Table
export class Thesis extends Model<Thesis> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  status?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: DataType.NOW,
  })
  startDate?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  extension?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  resourcesRequested?: boolean;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User, 'userId')
  user!: ReturnType<() => User>; // https://github.com/sequelize/sequelize-typescript/issues/825#issuecomment-1147027162
}

