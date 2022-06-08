import { Field, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
  @Field()
  @Column({ unique: true })
  familyCode: string;
}
