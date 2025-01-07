import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user';
import { Announcement } from './announcement';

@Table
export class UserAnnouncement extends Model<UserAnnouncement> {
  @ForeignKey(() => Announcement)
  @Column(DataType.INTEGER)
  announcementId!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  // Campo para el mensaje del estudiante
  @Column(DataType.TEXT)
  motivationMessage?: string;

  @BelongsTo(() => Announcement)
  announcement!: ReturnType<() => Announcement>;

  @BelongsTo(() => User)
  user!: ReturnType<() => User>;
}
