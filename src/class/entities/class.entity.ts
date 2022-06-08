import { Field, ObjectType } from "@nestjs/graphql";
import { Profile } from "src/profile/entities/profile.entity";
import { Student } from "src/profile/entities/student.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Session } from "./sessions.entity";

@ObjectType()
@Entity()
export class Class {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => Session)
  @ManyToOne(() => Session, (inverse) => inverse.classes)
  session: Session;

  @Field(() => Profile)
  @OneToOne(() => Profile)
  teacher: Profile;

  @Field(() => [Student])
  @OneToMany(() => Student, (inverse) => inverse.class)
  students: Student[];
}
