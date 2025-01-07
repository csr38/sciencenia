import {
    Table,
    Column,
    Model,
    DataType,
    BelongsToMany,
} from 'sequelize-typescript';
import { User } from './user';
import { UserAnnouncement } from './userAnnouncement';

@Table
export class Announcement extends Model<Announcement> {
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
        type: DataType.TEXT,
        allowNull: false,
    })
    description!: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    })
    isClosed!: boolean;

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: false,
        defaultValue: [],
    })
    targetAudiences!: string[];

    @BelongsToMany(() => User, () => UserAnnouncement)
    interestedStudents?: User[];
}
