import { IsString, IsEmail, IsArray, IsObject, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({ description: 'Usuario' })
  @IsString()
  Username: string;

  @ApiProperty({ description: 'Contraseña de usuario' })
  @IsString()
  Password: string;

  @IsString()
  hashedPassword?: string;

  @ApiProperty({ description: 'Nombre de usuario' })
  @IsString({ message: 'El nombre debe ser un texto' })
  Nombre: string;

  @ApiProperty({ description: 'Rol del usuario' })
  @IsString({ message: 'El rol debe ser un texto' })
  Rol: string;

  @ApiProperty({ description: 'Áreas del usuario' })
  @IsArray({ message: 'El area debe ser una matriz de texto' })
  Area: Types.ObjectId[];

  @ApiProperty({ description: 'Correo del usuario' })
  @IsEmail()
  Correo: string;

  @ApiProperty({ description: 'Extension telefonica del usuario' })
  @IsString({ message: 'La extension debe ser numerica' })
  Extension: string;

  @ApiProperty({ description: 'Telefono del usuario' })
  @IsString({ message: 'El telefono permite solo numeros' })
  Telefono: string;

  @ApiProperty({ description: 'Direccion general del usuario' })
  @IsString()
  Direccion_General: string;

  @ApiProperty({ description: 'Celulas a las que pertenece el usuario' })
  @IsOptional()
  @IsArray()
  Celula?: Types.ObjectId[];

  @ApiProperty({ description: 'Puesto del usuario' })
  @IsString({ message: 'El puesto debe ser un texto' })
  Puesto: string;

  @ApiProperty({ description: 'Ubicacion del usuario' })
  @IsString()
  Ubicacion: string;

  @ApiProperty({ description: 'Direccion del usuario' })
  @IsObject()
  Direccion: {
    Pais: string,
    Ciudad: string,
    codigoPostal: string
  };
}
