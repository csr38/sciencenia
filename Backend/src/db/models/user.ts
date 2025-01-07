import { Table, Column, Model, DataType, HasOne, HasMany, BelongsToMany, BelongsTo, ForeignKey, DefaultScope } from 'sequelize-typescript';
import { Scholarship } from './scholarship';
import { FundingRequest } from './fundingRequest';
import { Research } from './research';
import { UserResearch } from './userResearch';
import { Thesis } from './thesis';
import { File } from './file';
import { Researcher } from './researcher';
import { UserResearcher } from './userResearcher';
import { Announcement } from './announcement';
import { UserAnnouncement } from './userAnnouncement';

@DefaultScope(() => ({
  include: [
    { 
      model: File,
      as: 'picture', 
      attributes: ['id', 'fileName', 'mimeType', 'url', 'size'],
    },
    { 
      model: Researcher,
      as: 'tutors',
      through: { attributes: ['tutorRol'] },
    },
  ],
}))
@Table
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true, 
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  auth0Id?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  rut?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  names?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  secondLastName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  gender?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phoneNumber?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    //defaultValue: null,
  })
  academicDegree?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    //defaultValue: null,
  })
  institution?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    //defaultValue: null,
  })
  fullNameDegree!: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    //defaultValue: null
  })
  entryYear!: Date;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  researchLines?: string[];

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 2,
  })
  roleId?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  firebaseToken?: string;

  @HasOne(() => Thesis)
  thesis?: Thesis;

  @HasMany(() => Scholarship, {
    foreignKey: 'studentId',
  })
  scholarships?: Scholarship[];

  @HasMany(() => FundingRequest, {
    foreignKey: 'applicantId',  
  })
  fundingRequests?: FundingRequest[];

  @BelongsToMany(() => Research, () => UserResearch)
  research?: Research[];

  @BelongsToMany(() => Researcher, () => UserResearcher)
  tutors?: Researcher[];

  @ForeignKey(() => File)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  fileId?: number;

  @BelongsTo(() => File, 'fileId')
  picture?: File;

  @BelongsToMany(() => Announcement, () => UserAnnouncement)
  interestedAnnouncements?: Announcement[];
}
