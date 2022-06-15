import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Subject {
  @Field()
  @PrimaryColumn("varchar")
  id: string;

  @Field()
  @Column()
  code: string;

  @Field()
  @Column()
  name: string;

}