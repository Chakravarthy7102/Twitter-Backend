import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import bcrypt from "bcryptjs";
import { Post } from "./Post";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

@Entity({ name: "user" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({
    unique: true,
    type: "text",
  })
  username: string;

  @Column({ type: "text" })
  password: string;

  @Column({
    type: "text",
    default:
      "https://blog.uptrends.com/wp-content/uploads/2016/06/fred_profilepic-1.jpg",
  })
  profilePic: string;

  @OneToMany(() => Post, (photo) => photo.user)
  posts: Post[];

  @Column({ type: "int", default: 0 })
  followers: number;

  @Column({ type: "int", default: 0 })
  following: number;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfPasswordMatch(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
