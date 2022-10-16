import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Follow extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @ManyToOne(() => User)
  following: User;

  @ManyToOne(() => User)
  follower: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
