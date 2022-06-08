import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FamilyMember } from "./FamilyMember.entity";
import { Profile } from "./profile.entity";

@ObjectType()
@Entity()
export class Family {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Field()
  @Column()
  familyName: string;
  @Field(() => [FamilyMember])
  @OneToMany(() => FamilyMember, (member) => member.family, {
    eager: true,
    onDelete: "CASCADE",
  })
  members: FamilyMember[];
  @Field(() => [Profile])
  @ManyToOne(() => Profile)
  profiles: Profile[];

  @Field()
  @Column({ unique: true })
  familyCode: string;

  // @BeforeInsert()
  // changeId() {
  //   this.id = nanoid(32);
  // }

  // @AfterLoad()
  // getFundCode() {
  //   console.log(this.familyName);
  // }
}
