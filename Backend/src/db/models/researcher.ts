import { Table, Column, Model, DataType, BelongsToMany, ForeignKey, BelongsTo, DefaultScope} from 'sequelize-typescript';
import { User } from './user';
import { UserResearcher } from './userResearcher';
import { File } from './file';

export function capitalizeEachWord(text) {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

@DefaultScope(() => ({
  include: [
    { 
      model: File,
      as: 'picture', 
      attributes: ['id', 'fileName', 'mimeType', 'url', 'size'],
    }
  ],
}))
@Table
export class Researcher extends Model<Researcher> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true, 
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    set(value: string | null) {
      if (value) {
        this.setDataValue('names', capitalizeEachWord(value));
      } else {
        this.setDataValue('names', value);
      }
    }
  })
  names!: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
    set(value: string | null) {
      if (value) {
        this.setDataValue('lastName', capitalizeEachWord(value));
      } else {
        this.setDataValue('lastName', value);
      }
    }
  })
  lastName!: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: true,
    set(value: string | null) {
      if (value) {
        this.setDataValue('secondLastName', capitalizeEachWord(value));
      } else {
        this.setDataValue('secondLastName', value);
      }
    }
  })
  secondLastName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  nationality!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  rut!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
        isEmail: true,
    },
    set(value: string | null) {
      if (value) {
        this.setDataValue('email', value.toLowerCase());
      } else {
        this.setDataValue('email', value);
      }
    }
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  phone?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  charge!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  researchLines!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    set(value: string | null) {
      if (value) {
        this.setDataValue('highestTitle', capitalizeEachWord(value));
      } else {
        this.setDataValue('highestTitle', value);
      }
    }
  })
  highestTitle!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    set(value: string | null) {
      if (value) {
        this.setDataValue('highestDegree', capitalizeEachWord(value));
      } else {
        this.setDataValue('highestDegree', value);
      }
    }
  })
  highestDegree!: string;

  @BelongsToMany(() => User, () => UserResearcher)
  students: User[];

  @ForeignKey(() => File)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  fileId?: number;

  @BelongsTo(() => File, 'fileId')
  picture?: File;
}