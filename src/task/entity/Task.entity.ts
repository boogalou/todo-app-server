import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entity/UserEntity';

@Entity({ name: 'tasks' })
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  label: string;

  @Column()
  category: string;

  @Column({ name: 'due_date' })
  dueDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_completed' })
  isCompleted: boolean;

  @ManyToOne(() => UserEntity, (user) => user.tasks)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
