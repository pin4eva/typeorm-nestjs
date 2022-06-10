import { Field, ObjectType } from "@nestjs/graphql";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { Family } from "./Family.entity";
import { Profile } from "./profile.entity";

@ObjectType()
@Entity()
export class FamilyMember {
  @Field(() => String)
  @PrimaryColumn("character varying")
  id: string;
  @Field()
  @Column()
  role: string;
  @Field(() => Profile)
  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;
  @Field(() => Family)
  @ManyToOne(() => Family, (family) => family.members, {
    onDelete: "CASCADE",
    orphanedRowAction: "nullify",
  })
  @JoinColumn()
  family: Family;
}
