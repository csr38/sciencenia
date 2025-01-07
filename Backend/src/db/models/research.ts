import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Research extends Model<Research> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "",
  })
  doi!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  authors!: string[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "",
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "",
  })
  journal!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "",
  })
  volume!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  yearPublished!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "",
  })
  firstPage!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "",
  })
  lastPage!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "",
  })
  notes!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  indexed!: string[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "",
  })
  funding!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  researchLines!: string[];

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  progressReport!: number;

  @Column({
    type: DataType.ARRAY(DataType.JSON),
    allowNull: false,
    defaultValue: [],
  })
  ceniaParticipants!: { name: string; role: string }[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  roleParticipations!: string[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "",
  })
  link!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "",
  })
  anidNotes!: string;
}