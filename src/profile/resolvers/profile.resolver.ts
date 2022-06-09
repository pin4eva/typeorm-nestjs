import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GQLAuthGaurd } from "src/guards/auth.guard";
import { CurrentUser } from "src/middlewares/current-user.middleware";
import { CreateProfileInput, UpdateProfileInput } from "../dto/profile.dto";
import { Profile } from "../entities/profile.entity";
import { ProfileService } from "../services/profile.service";

@Resolver()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(GQLAuthGaurd)
  @Query(() => Profile)
  async me(@CurrentUser() user: Profile) {
    return this.profileService.getMe(user.id);
  }
  @Query(() => [Profile])
  async getProfiles() {
    return this.profileService.getProfiles();
  }
  @Query(() => [Profile])
  async searchProfilesByName(@Args("name") name: string) {
    return this.profileService.searchProfileByName(name);
  }
  @Query(() => Profile)
  async getProfile(@Args("id") id: string) {
    return this.profileService.getProfile(id);
  }

  @Mutation(() => Profile)
  async createProfile(@Args("input") input: CreateProfileInput) {
    const profile = await this.profileService.createProfile(input);

    return profile;
  }
  // @UseGuards(GQLAuthGaurd)
  @Mutation(() => Profile)
  async updateProfile(@Args("input") input: UpdateProfileInput) {
    return this.profileService.updateProfile(input);
  }
  @UseGuards(GQLAuthGaurd)
  @Mutation(() => Profile)
  async deleteProfile(@Args("id") id: string) {
    return this.profileService.deleteProfile(id);
  }
  // @UseGuards(GQLAuthGaurd)
  @Mutation(() => [Profile])
  async deleteAllProfile() {
    return this.profileService.deleteAllProfile();
  }
}
