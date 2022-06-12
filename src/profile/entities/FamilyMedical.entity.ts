import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, PrimaryColumn, Column, OneToOne } from 'typeorm';
import { Family } from './Family.entity';

@ObjectType()
@Entity()
export class FamilyMedical {
  @Field()
  @PrimaryColumn("varchar")
  id: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  hospitalName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  hospitalAddress: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  hospitalPhone: string;

  @OneToOne(() => Family, inverse => inverse.medicals)
  family: Family
}