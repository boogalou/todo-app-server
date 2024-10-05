import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { TaskEntity } from '../../task/entity/Task.entity';
import { UserSettingsEntity } from '../../user-settings/entity/user-settings.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ name: 'user_pic', nullable: true })
  userPic: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => TaskEntity, (task) => task.user, { cascade: true })
  tasks: TaskEntity[];

  @OneToOne(() => UserSettingsEntity, (settings) => settings.user, { cascade: true })
  settings: UserSettingsEntity;

  @BeforeInsert()
  private async hashPassword() {
    this.password = await hash(this.password, 12);
  }
}
