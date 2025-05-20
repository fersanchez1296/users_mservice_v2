import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { sanitizeString } from 'src/common/utils/sanitize-string.util';

@Injectable()
export class GenerateUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (!request.body.Nombre) {
      throw new BadRequestException('El nombre es requerido');
    }
    let [firstName, lastName] = request.body.Nombre.split(' ');
    if (!lastName) {
      throw new BadRequestException(
        'El formato para el nombre debe contener al menos un nombre y un apellido',
      );
    }

    firstName = sanitizeString(firstName);
    lastName = sanitizeString(lastName);
    const randomNumber = Math.floor(10 + Math.random() * 90);

    const username = `${firstName[0].toUpperCase()}${lastName.charAt(0).toUpperCase()}${lastName.slice(1).toLowerCase()}${randomNumber}`;
    request.body.Username = username;
    return next.handle();
  }
}
