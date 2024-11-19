import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // Secret key para JWT
    });
  }

  async validate(payload: any) {
    // console.log("Payload in JWT Strategy:", payload);
    // Retornar un objeto con userId y otros campos necesarios
    return { userId: payload.sub, email: payload.email, roles: payload.roles };
  }
}
