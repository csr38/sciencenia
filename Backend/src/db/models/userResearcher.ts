import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user';
import { Researcher } from './researcher';

@Table
export class UserResearcher extends Model<UserResearcher> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id!: number;

  @BelongsTo(() => User, 'user_id')
  user!: ReturnType<() => User>;

  @ForeignKey(() => Researcher)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  researcher_id!: number;

  @BelongsTo(() => Researcher, 'researcher_id')
  researcher!: ReturnType<() => Researcher>;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  tutorRol?: string;
}