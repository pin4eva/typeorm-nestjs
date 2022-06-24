import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Auth } from "./entities/auth.entity";
import { Profile } from "../profile/entities/profile.entity";
import { ProfileModule } from "../profile/profile.module";

@Module({
  providers: [AuthResolver, AuthService],
  imports: [TypeOrmModule.forFeature([Auth, Profile]), ProfileModule],
})
export class AuthModule {}
