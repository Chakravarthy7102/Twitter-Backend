import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Like } from "./Like";
import { Retweet } from "./Retweet";
import { User } from "./User";

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "json", array: true, default: [] })
  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @Column({
    type: "text",
    nullable: false,
  })
  content: string;

  @Column({ type: "json", array: true, default: [] })
  @OneToMany(() => Retweet, (retweet) => retweet.post)
  retweets: Retweet[];

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
