import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GQLAuthGaurd } from "src/guards/auth.guard";
import { CurrentUser } from "src/middlewares/current-user.middleware";
import { Profile } from "src/profile/entities/profile.entity";
import { AuthService } from "./auth.service";
import {
  ChangeAuthPasswordInput,
  ForgotPasswordInput,
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

  @Mutation(() => Auth)
  signup(@Args("input") input: SignupInput) {
    return this.authService.signup(input);
  }
  @Mutation(() => LoginResponse)
  login(@Args("input") input: LoginInput) {
    return this.authService.login(input);
  }

  // Send Invite
  @Query(() => Boolean)
  sendInvit(@Args("id") id: string) {
    return this.authService.sendInvite(id);
  }

  // Reset Password
  @Mutation(() => Boolean)
  resetPassword(@Args("email") email: string) {
    return this.authService.resetPassword(email);
  }
  // Forgot Password
  @Mutation(() => Boolean)
  forgotPassword(@Args("input") input: ForgotPasswordInput) {
    return this.authService.forgotPassword(input);
  }

  // Change AuthPassword
  @UseGuards(GQLAuthGaurd)
  @Mutation(() => Boolean)
  async changeAuthPassword(
    @Args("input") input: ChangeAuthPasswordInput,
    @CurrentUser() user: Profile,
  ) {
    return this.authService.changeAuthPassword(input, user.id);
  }

  // DeletePassword
  @UseGuards()
  @Mutation(() => Auth)
  deleteAuth(@Args("id") id: string) {
    return this.authService.deleteAuth(id);
  }
}
