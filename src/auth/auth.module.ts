import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { Profile } from 'src/profile/entities/profile.entity';

@Module({
  providers: [AuthResolver, AuthService],
  imports: [TypeOrmModule.forFeature([Auth, Profile]), ProfileModule],
})
export class AuthModule {}
