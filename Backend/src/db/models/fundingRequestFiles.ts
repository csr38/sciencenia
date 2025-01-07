import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { FundingRequest } from './fundingRequest';
import { File } from './file';

@Table
export class FundingRequestFiles extends Model<FundingRequestFiles> {
  @ForeignKey(() => FundingRequest)
  @Column
  fundingRequestId!: number;

  @ForeignKey(() => File)
  @Column
  fileId!: number;
}
