import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClassRoom } from "./class.entity";

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

  @Field(() => [ClassRoom])
  @OneToMany(() => ClassRoom, (inverse) => inverse.session)
  classes: ClassRoom[];

  @Field()
  @Column({ default: false })
  isCurrent: boolean;
}
