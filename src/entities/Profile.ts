import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Index("userid-index")
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

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
