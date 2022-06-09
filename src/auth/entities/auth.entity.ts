import { Field, ObjectType } from "@nestjs/graphql";
import { Profile } from "src/profile/entities/profile.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

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
