import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Theme } from '../enums/theme.enum';
import { Lang } from '../enums/lang.enum';

@Entity({ name: 'settings' })
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'language', enum: Lang, default: Lang.ENG, nullable: false })
  language: Lang;

  @Column({ name: 'theme', enum: Theme, default: Theme.SYSTEM, nullable: false })
  theme: Theme;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.settings, { lazy: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
