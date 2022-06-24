import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { ClassRoom } from "./class.entity";

@ObjectType()
@Entity()
export class Session {
  @Field()
  @PrimaryColumn("character varying")
  id: string;

  @Field(() => Int)
  @Column({ unique: true })
  year: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => [ClassRoom])
  @OneToMany(() => ClassRoom, (inverse) => inverse.session)
  classes: ClassRoom[];

  @Field()
  @Column({ default: false })
  isCurrent: boolean;
}
