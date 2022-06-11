import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { FamilyMember } from "./FamilyMember.entity";

@ObjectType()
@Entity()
export class Family {
  @Field(() => String)
  @PrimaryColumn("character varying")
  id: string;

  @Field()
  @Column()
  familyName: string;

  @Field(() => [FamilyMember])
  @OneToMany(() => FamilyMember, (member) => member.family)
  members: FamilyMember[];

  @Field()
  @Column({ unique: true })
  familyCode: string;
}
