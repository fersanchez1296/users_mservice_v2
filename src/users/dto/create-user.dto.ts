import { IsString, IsEmail, IsArray } from 'class-validator';
import { Types } from 'mongoose';
export class CreateUserDto {
  @IsString()
  Username: string;

  @IsString()
  Password: string;

  @IsString()
  Nombre: string;

  @IsArray()
  Rol: Types.ObjectId[];

  @IsArray()
  Area: Types.ObjectId[];

  @IsEmail()
  Correo: string;
}
