import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Family } from './Family.entity';

@ObjectType()
@Entity()
export class FamilyHospital {
  @Field()
  @PrimaryColumn("varchar")
  id: string

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  address: string;

  @Field()
  @Column()
  contactPhone: string;

  @Field()
  @Column()
  contactName: string

  @Field(() => Family)
  @ManyToOne(() => Family, inverse => inverse.hospitals)
  family: Family
}