import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { ProfileService } from "../profile/services/profile.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private profileService: ProfileService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const token = request.session.token;

    console.log("FROM CurrentUserInterceptor:", token);
    return next.handle();
  }
}
