import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@ObjectType()
@Entity()
export class Student {
  // @Column({ type: Types.ObjectId, ref: 'Class', autopopulate: true })
  // class: ClassDocument;
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field(() => [String])
  @Column('simple-array', { nullable: true })
  subjects: string[];
  @Field(() => Profile)
  @OneToOne(() => Profile, (profile) => profile.student)
  @JoinColumn()
  profile: Profile;
  @Field()
  @Column()
  regNo: string;

  // @Column({
  //   type: [{ type: Types.ObjectId, ref: 'Contact', autopopulate: true }],
  // })
  // contacts: ContactDocument
  @Field()
  @Column()
  status: string;
}
