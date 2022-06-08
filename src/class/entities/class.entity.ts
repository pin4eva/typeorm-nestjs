import { Field, ObjectType } from "@nestjs/graphql";
import { Profile } from "src/profile/entities/profile.entity";
import { Student } from "src/profile/entities/student.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Session } from "./sessions.entity";

@ObjectType()
@Entity()
export class ClassRoom {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => Session, { nullable: true })
  @ManyToOne(() => Session, (inverse) => inverse.classes)
  session: Session;

  @Field(() => Profile, { nullable: true })
  @OneToOne(() => Profile)
  @JoinColumn()
  teacher: Profile;

  @Field(() => [Student], { nullable: true })
  @OneToMany(() => Student, (inverse) => inverse.class)
  students: Student[];
}
