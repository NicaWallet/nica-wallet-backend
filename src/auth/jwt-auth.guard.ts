import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Ejecutar el método de la clase base para autenticar y asignar el user
    const result = super.canActivate(context);

    // Verifica si el resultado es una promesa y maneja el retorno correctamente
    if (result instanceof Promise) {
      return result.then(() => {
        // const request = context.switchToHttp().getRequest();
        // const user = request.user;
        // console.log("User from JWT Guard after authentication:", user);
        return true;
      });
    }

    // Si es un booleano o un Observable, simplemente retorna
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log("User from JWT Guard after authentication:", user);
    return result;
  }
}
