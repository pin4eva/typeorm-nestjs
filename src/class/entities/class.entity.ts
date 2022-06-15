import { Field, ObjectType } from "@nestjs/graphql";
import { Attendance } from "src/attendance/entities/attendance.entity";

import { Profile } from "src/profile/entities/profile.entity";
import { Student } from "src/student/entities/student.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
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
  @OneToMany(() => Student, (inverse) => inverse.class, { cascade: true })
  @JoinColumn()
  students: Student[];

  @Field(() => [Attendance])
  @OneToMany(() => Attendance, (attendance) => attendance.class)
  attendance: Attendance[];
}
