import { IsString, IsEmail, IsArray } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({ description: 'Usuario' })
  @IsString()
  Username: string;

  @ApiProperty({ description: 'Contraseña de usuario' })
  @IsString()
  Password: string;

  @ApiProperty({ description: 'Nombre de usuario' })
  @IsString()
  Nombre: string;

  @ApiProperty({ description: 'Rol del usuario' })
  @IsArray()
  Rol: Types.ObjectId[];

  @ApiProperty({ description: 'Áreas del usuario' })
  @IsArray()
  Area: Types.ObjectId[];

  @ApiProperty({ description: 'Correo del usuario' })
  @IsEmail()
  Correo: string;
}
