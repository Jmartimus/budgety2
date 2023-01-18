import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import appConfig from 'src/config/app.config';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './dataStructureFiles/auth.interfaces';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel('UserSchema')
    private readonly authModel: Model<User>
  ) {
    super({
      secretOrKey: appConfig().secret_key,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;
    const user: User = await this.authModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
