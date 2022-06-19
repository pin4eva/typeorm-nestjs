import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Attendance } from "src/attendance/entities/attendance.entity";
import { ClassRoom } from "src/class/entities/class.entity";
import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { Profile } from "../../profile/entities/profile.entity";
import { StudentContact } from "./student-contact.entity";
import { StudentMedical } from "./student-medical.entity";

@ObjectType()
@Entity()
export class Student {
  @Field(() => ID)
  @PrimaryColumn("character varying")
  id: string;
  @Field(() => ClassRoom)
  class: ClassRoom;
  @Field(() => [String])
  @Column("simple-array", { nullable: true })
  subjects: string[];
  @Field(() => Profile, { nullable: true })
  @OneToOne(() => Profile, (profile) => profile.student, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  profile: Profile;
  @Field()
  @Column()
  regNo: string;
  @Field({ nullable: true })
  @Column({ nullable: true })
  status: string;

  @Field(() => [StudentContact])
  @OneToMany(() => StudentContact, (inverse) => inverse.student)
  contacts: StudentContact[];

  @Field(() => StudentMedical, { nullable: true })
  @OneToOne(() => StudentMedical, (inverse) => inverse.student, {
    onDelete: "SET NULL",
  })
  @JoinColumn()
  medicalRecord: StudentMedical;

  @Field(() => [Attendance])
  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendance: Attendance[];

  @AfterLoad()
  getRegNoInUpper() {
    this.regNo = this.regNo.toUpperCase();
  }
}
