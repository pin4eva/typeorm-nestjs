import { ObjectType, Field } from "@nestjs/graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Family } from "./Family.entity";
import { Profile } from "./profile.entity";

@ObjectType()
@Entity()
export class FamilyMember {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Field()
  @Column()
  role: string;
  @Field(() => Profile)
  @OneToOne(() => Profile, { eager: true })
  @JoinColumn()
  profile: Profile;
  @Field(() => Family)
  @ManyToOne(() => Family, (family) => family.members, { onDelete: "CASCADE" })
  @JoinColumn()
  family: Family;
}
