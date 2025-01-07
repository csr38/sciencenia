import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { Scholarship } from './scholarship';
import { File } from './file';

@Table
export class ScholarshipFiles extends Model<ScholarshipFiles> {
  @ForeignKey(() => Scholarship)
  @Column
  scholarshipId!: number;

  @ForeignKey(() => File)
  @Column
  fileId!: number;
}
