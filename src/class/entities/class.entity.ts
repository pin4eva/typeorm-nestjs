import { Field, ObjectType } from "@nestjs/graphql";
import { Profile } from "src/profile/entities/profile.entity";
import { Student } from "src/profile/entities/student.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
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
  @ManyToOne(() => Session, (inverse) => inverse.classes, {
    onDelete: "CASCADE",
  })
  session: Session;

  @Field(() => Profile, { nullable: true })
  @ManyToOne(() => Profile, (inverse) => inverse.classes)
  teacher: Profile;

  @Field(() => [Student], { nullable: true })
  @OneToMany(() => Student, (inverse) => inverse.class)
  students: Student[];
}
