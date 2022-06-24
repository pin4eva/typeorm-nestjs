import { Field, ObjectType } from "@nestjs/graphql";

import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Profile } from "../../profile/entities/profile.entity";

@Entity()
@ObjectType()
export class Auth {
  @PrimaryColumn("character varying")
  @Field()
  id: string;
  @Column()
  @Field()
  email: string;
  @Column({ nullable: true })
  emailToken: string;
  @Column()
  password: string;
  @Field(() => Profile)
  @OneToOne(() => Profile, { eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  profile: Profile;
}
