import { Field, ObjectType } from "@nestjs/graphql";
import { ClassRoom } from "src/class/entities/class.entity";
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Profile } from "./profile.entity";

@ObjectType()
@Entity()
export class Student {
  @Field()
  @OneToMany(() => ClassRoom, (inverse) => inverse.students)
  class: ClassRoom;
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Field(() => [String])
  @Column("simple-array", { nullable: true })
  subjects: string[];
  @Field(() => Profile)
  @OneToOne(() => Profile, (profile) => profile.student)
  @JoinColumn()
  profile: Profile;
  @Field()
  @Column()
  regNo: string;

  // @Column({
  //   type: [{ type: Types.ObjectId, ref: 'Contact', autopopulate: true }],
  // })
  // contacts: ContactDocument
  @Field()
  @Column()
  status: string;
}
