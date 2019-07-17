import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './document.category.enum';
import { User } from '../auth/user.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  text!: string;

  @Column()
  category!: Category;

  @ManyToOne(type => User, user => user.documents, { eager: false })
  user!: User;

  @Column()
  userid!: number;
}
