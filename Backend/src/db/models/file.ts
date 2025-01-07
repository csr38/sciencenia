import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { User } from './user';

@Table
export class File extends Model<File> {
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
  fileName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  filePath!: string; // Ruta local del archivo

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  key!: string; // ID del bucket S3

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  mimeType!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  size!: number; 

  @HasMany(() => User, {
    foreignKey: 'fileId',
    as: 'userProfiles',
  })
  userProfiles?: User[];
}

