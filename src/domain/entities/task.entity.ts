import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  category: string;

  @Column({ name: 'due_date', type: 'timestamp with time zone', nullable: false })
  dueDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', nullable: false })
  updatedAt: Date;

  @Column({ name: 'is_completed', nullable: false })
  isCompleted: boolean;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE', lazy: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Promise<User>;
}
