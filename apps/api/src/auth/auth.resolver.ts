import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GQLAuthGaurd } from "../guards/auth.guard";
import { CurrentUser } from "../middlewares/current-user.middleware";
import { Profile } from "../profile/entities/profile.entity";

import { AuthService } from "./auth.service";
import {
  ChangeAuthPasswordInput,
  CreateNewPasswordInput,
  LoginInput,
  LoginResponse,
  SignupInput,
} from "./dto/auth.dto";
import { Auth } from "./entities/auth.entity";

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(GQLAuthGaurd)
  @Query(() => [Auth], { nullable: true })
  getAuths() {
    return this.authService.getAuths();
  }

  @Mutation(() => Profile)
  signup(@Args("input") input: SignupInput) {
    return this.authService.signup(input);
  }
  @Mutation(() => LoginResponse)
  login(@Args("input") input: LoginInput) {
    return this.authService.login(input);
  }

  // Send Invite
  @Mutation(() => Boolean)
  sendInvite(@Args("id") id: string) {
    return this.authService.sendInvite(id);
  }

  // Reset Password
  @Mutation(() => Boolean)
  resetPassword(@Args("email") email: string) {
    return this.authService.resetPassword(email);
  }

  // Reset Auth. ie delete auth and create a new oe with updated email
  @Mutation(() => Profile)
  restestAuth(@Args("profileId") profileId: string) {
    return this.authService.resetAuth(profileId);
  }
  // Forgot Password
  @Mutation(() => Boolean)
  createNewPassword(@Args("input") input: CreateNewPasswordInput) {
    return this.authService.createNewPassword(input);
  }

  // Change AuthPassword
  @UseGuards(GQLAuthGaurd)
  @Mutation(() => Boolean)
  async changeAuthPassword(
    @Args("input") input: ChangeAuthPasswordInput,
    @CurrentUser() user: Profile,
  ) {
    return this.authService.changeAuthPassword({ ...input, id: user.id });
  }

  // DeletePassword
  @UseGuards()
  @Mutation(() => Auth)
  deleteAuth(@Args("id") id: string) {
    return this.authService.deleteAuth(id);
  }
}
