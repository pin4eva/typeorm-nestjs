import { Field, ObjectType } from "@nestjs/graphql";
import {
  AfterUpdate,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Unique,
} from "typeorm";

import { ClassRoom } from "../../class/entities/class.entity";
import { Family } from "../../family/entities/Family.entity";
import { Student } from "../../student/entities/student.entity";
import { generateFullName } from "../../utils/helpers";
import { AccountTypeEnum } from "../interfaces/profile.interface";

@ObjectType()
@Entity()
@Unique(["email"])
export class Profile {
  @Field()
  @PrimaryColumn("character varying")
  id: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  middleName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  otherName: string;

  @Field()
  @Column({ nullable: true })
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  role: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  image: string;

  @Field()
  @Column({ nullable: true })
  lastSeen: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  emailToken: string;

  @Field()
  @Column({ type: Boolean, default: false })
  isPhoneVerified: boolean;

  @Field()
  @Column({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Field()
  @Column({ type: Boolean, default: false })
  isActive: boolean;

  @Field(() => String)
  @Column({
    type: String,
    enum: AccountTypeEnum,
    default: AccountTypeEnum.None,
  })
  accountType: AccountTypeEnum;

  @Field(() => [String], { nullable: true })
  @Column({
    type: "simple-array",
    enum: AccountTypeEnum,
    default: AccountTypeEnum.Guest,
  })
  accountTypes: AccountTypeEnum[];

  @Field(() => Student, { nullable: true })
  @OneToOne(() => Student, (student) => student.profile, {
    onDelete: "CASCADE",
    orphanedRowAction: "delete",
  })
  student: Student;

  @Field(() => [ClassRoom])
  @OneToMany(() => ClassRoom, (inverse) => inverse.teacher)
  classes: ClassRoom[];

  @Field()
  @Column()
  gender: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  dob: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  occupation: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  state: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lga: string;

  @Field(() => Family, { nullable: true })
  @ManyToOne(() => Family, (family) => family.members)
  // @JoinColumn()
  family: Family;

  // @Field(() => FamilyMember)
  // @OneToOne(() => FamilyMember, (member) => member.profile)
  // memberIn: FamilyMember;

  @BeforeInsert()
  @AfterUpdate()
  setName() {
    this.name = generateFullName({
      firstName: this.firstName,
      middleName: this.middleName,
      otherName: this.otherName,
      lastName: this.lastName,
    });
  }
}
