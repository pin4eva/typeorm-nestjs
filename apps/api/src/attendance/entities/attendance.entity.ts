import { Field, ID, Int, ObjectType, registerEnumType } from "@nestjs/graphql";

import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { ClassRoom } from "../../class/entities/class.entity";
import { Student } from "../../student/entities/student.entity";

export enum TermEnum {
  FIRST_TERM = "First term",
  SECOND_TERM = "Second term",
  THIRD_TERM = "Third term",
}

registerEnumType(TermEnum, { name: "Term", description: "Session term" });

@ObjectType()
@Entity()
export class Attendance {
  @Field(() => ID)
  @PrimaryColumn("varchar")
  id: string;

  @Field(() => Student)
  @ManyToOne(() => Student)
  student: Student;

  @Field(() => ClassRoom)
  @ManyToOne(() => ClassRoom)
  class: ClassRoom;

  @Field(() => TermEnum)
  @Column({ type: "enum", enum: TermEnum, default: TermEnum.FIRST_TERM })
  term: TermEnum;

  @Field()
  @Column()
  date: Date;

  @Field(() => Int)
  @Column()
  week: number;
}
