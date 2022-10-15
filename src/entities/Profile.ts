import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ type: "uuid" })
  userId: string;

  @Column({
    type: "text",
  })
  location: string;

  @Column({ type: "date" })
  dob: Date;

  @Column({ type: "text", default: "" })
  about: string;

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
}
