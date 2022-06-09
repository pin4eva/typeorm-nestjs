import { Field, ID, ObjectType } from "@nestjs/graphql";
import { ClassRoom } from "src/class/entities/class.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { Profile } from "../../profile/entities/profile.entity";

@ObjectType()
@Entity()
export class Student {
  @Field(() => ID)
  @PrimaryColumn("character varying")
  id: string;
  @Field(() => ClassRoom)
  @ManyToOne(() => ClassRoom, (inverse) => inverse.students, {
    orphanedRowAction: "delete",
  })
  // @JoinTable()
  class: ClassRoom;
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
  @Field({ nullable: true })
  @Column({ nullable: true })
  status: string;
}
