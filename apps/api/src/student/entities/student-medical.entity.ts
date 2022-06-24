import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";
import { Student } from "./student.entity";

@ObjectType()
@Entity()
export class StudentMedical {
  @Field(() => ID)
  @PrimaryColumn()
  id: string;

  @Field(() => [String], { nullable: true })
  @Column("simple-array", { nullable: true })
  allergies: string[];

  @Field(() => [String], { nullable: true })
  @Column("simple-array", { nullable: true })
  routineDrugs: string[];

  @Field(() => [String], { nullable: true })
  @Column("simple-array", { nullable: true })
  drugReactions: string[];

  @Field(() => Student)
  @OneToOne(() => Student, (inverse) => inverse.medicalRecord)
  student: Student;
}
