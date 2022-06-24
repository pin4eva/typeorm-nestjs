import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { Attendance } from "../../attendance/entities/attendance.entity";
import { Profile } from "../../profile/entities/profile.entity";
import { Student } from "../../student/entities/student.entity";
import { Session } from "./sessions.entity";

@ObjectType()
@Entity()
export class ClassRoom {
  @Field()
  @PrimaryColumn("character varying")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => Session, { nullable: true })
  @ManyToOne(() => Session, (inverse) => inverse.classes, {
    onDelete: "CASCADE",
  })
  session: Session;

  @Field(() => Profile, { nullable: true })
  @ManyToOne(() => Profile, (inverse) => inverse.classes)
  teacher: Profile;

  @Field(() => [Student], { nullable: true })
  @ManyToMany(() => Student, { cascade: true })
  @JoinTable({ name: "class_students" })
  students: Student[];

  @Field(() => [Attendance])
  @OneToMany(() => Attendance, (attendance) => attendance.class)
  attendance: Attendance[];
}
