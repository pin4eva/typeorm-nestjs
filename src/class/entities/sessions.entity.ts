import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Class } from "./class.entity";

@ObjectType()
@Entity()
export class Session {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Int)
  @Column({ unique: true })
  year: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => [Class])
  @OneToMany(() => Class, (inverse) => inverse.session)
  classes: Class[];

  @Field()
  @Column({ default: false })
  isCurrent: boolean;
}
