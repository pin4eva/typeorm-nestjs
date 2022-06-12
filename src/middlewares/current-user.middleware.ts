/* eslint-disable @typescript-eslint/no-namespace */
import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { NextFunction, Request, Response } from 'express';
import { ProfileService } from '../profile/services/profile.service';
import { Profile } from '../profile/entities/profile.entity';

declare global {
  namespace Express {
    interface Request {
      token?: string;
      user?: Profile;
    }
  }
}

export const CurrentUser = createParamDecorator(
  (_: never, contex: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(contex);
    const user = ctx.getContext().req.user;

    return user;
  },
);

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private profileService: ProfileService) {}

  async use(req: Request, _: Response, next: NextFunction) {
    const payload = req.headers?.authorization;

    const user = await this.profileService.decodeJWT(payload);

    req.user = user;

    next();
  }
}
