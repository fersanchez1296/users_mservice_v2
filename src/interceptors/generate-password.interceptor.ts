import {
    BadRequestException,
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class GeneratePasswordInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        if (!request.body.Nombre) {
            throw new BadRequestException('El nombre es requerido');
        }
        const Nombre: string = request.body.Nombre;

        const normalizedNombre = Nombre.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/ñ/g, 'n')
            .replace(/Ñ/g, 'N');

        const words = normalizedNombre
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .filter((word) => word.length > 0);

        if (words.length === 0) {
            throw new BadRequestException(
                "El campo 'Nombre' debe contener palabras válidas",
            );
        }

        const shuffledWords = words.sort(() => Math.random() - 0.5);
        const nameBase = shuffledWords.slice(0, 2).join('');
        const randomNumbers = crypto.randomInt(10, 99);
        const symbols = ['-', '#', '$', '_', '*', '!'];
        const randomSymbol = symbols[crypto.randomInt(0, symbols.length)];
        const generatedPassword = `${nameBase}${randomNumbers}${randomSymbol}`;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(generatedPassword, salt);
        request.body.Password = generatedPassword;
        request.body.hashedPassword = hashedPassword;
        return next.handle();
    }
}
