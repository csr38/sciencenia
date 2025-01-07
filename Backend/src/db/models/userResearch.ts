import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { User } from './user';
import { Research } from './research';

@Table
export class UserResearch extends Model<UserResearch> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Research)
  @Column
  researchId: number;
}