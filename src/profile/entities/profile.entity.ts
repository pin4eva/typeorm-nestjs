import { Field, ObjectType } from "@nestjs/graphql";
import {
  AfterUpdate,
  BeforeInsert,
  Column,
  Entity,
  EntitySubscriberInterface,
  EventSubscriber,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AccountTypeEnum } from "../interfaces/profile.interface";
import { Family } from "./Family.entity";
import { Student } from "./student.entity";

@ObjectType()
@Entity()
export class Profile {
  @Field()
  @PrimaryGeneratedColumn("uuid")
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
  @Field()
  @Column({ nullable: true })
  otherName: string;
  @Field()
  @Column({ nullable: true })
  name: string;
  @Field({ nullable: true })
  @Column({ nullable: true })
  email: string;
  @Field()
  @Column({ nullable: true })
  phone: string;
  @Field()
  @Column({ nullable: true })
  role: string;
  @Field({ nullable: true })
  @Column({ nullable: true })
  image: string;
  @Field()
  @Column({ nullable: true })
  lastSeen: Date;
  @Field()
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
  @Field(() => [String])
  @Column({
    type: "enum",
    enum: AccountTypeEnum,
    default: AccountTypeEnum.Guest,
  })
  accountTypes: AccountTypeEnum[];
  @Field(() => Student)
  @OneToOne(() => Student, (student) => student.profile)
  student: Student;

  @Field()
  @Column()
  gender: string;
  @Field()
  @Column({ nullable: true })
  dob: Date;
  @Field()
  @Column({ nullable: true })
  occupation: string;
  @Field()
  @Column({ nullable: true })
  state: string;
  @Field()
  @Column({ nullable: true })
  lga: string;
  @OneToMany(() => Family, (family) => family.members, { onDelete: "SET NULL" })
  @JoinColumn()
  @Field(() => Family, { nullable: true })
  family: Family;
  @BeforeInsert()
  @AfterUpdate()
  setName() {
    this.name = `${this.firstName} ${this.middleName}${
      this.otherName ? ` ${this.otherName}` : ""
    } ${this.lastName}`;
  }
}

@EventSubscriber()
export class ProfileSubscriber implements EntitySubscriberInterface<Profile> {
  listenTo() {
    return Profile;
  }

  async afterLoad(profile: Profile) {
    profile.name = `${profile.firstName} ${profile.middleName}${
      profile.otherName ? ` ${profile.otherName}` : ""
    } ${profile.lastName}`;
  }
}
