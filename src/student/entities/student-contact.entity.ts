import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { Student } from './student.entity';

@ObjectType()
@Entity()
export class StudentContact {
  @Field(() => ID)
  @PrimaryColumn()
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  phone: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image: string;

  @Field()
  @Column()
  contactType: string;

  @Field(() => Student)
  @ManyToOne(() => Student, inverse => inverse.contacts)
  student: Student

}