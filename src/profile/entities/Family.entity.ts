import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { FamilyMedical } from './FamilyMedical.entity';
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

  @Field({ nullable: true })
  @Column({ nullable: true })
  address: string;

  @Field()
  @OneToOne(() => FamilyMedical, inverse => inverse.family)
  @JoinColumn()
  medicals: FamilyMedical

}

