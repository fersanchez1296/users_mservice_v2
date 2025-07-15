import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Rol } from './rol.schema';
import { Area } from './area.schema';
import { Celula } from './celula.schema';

@Schema({ collection: 'Usuarios', versionKey: false })
export class Usuarios {
  @Prop({ required: true })
  Username?: string;

  @Prop({ required: true })
  Password: string;

  @Prop({ required: true })
  Nombre: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Rol' })
  Rol: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Dependencia', default: "679b8a12c9c34d1de358f1cd" })
  Dependencia: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Area' }],
  })
  Area: Area[];

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId, ref: 'DireccionGeneral',
  })
  Direccion_General: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  Correo: string;

  @Prop({ default: "0000000000" })
  Telefono: string;

  @Prop({ default: "00000" })
  Extension: string;

  @Prop()
  Ubicacion: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Puesto' })
  Puesto: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: {
      Pais: { type: String, default: "México" },
      Ciudad: { type: String, default: "Guadalajara/Jalisco" },
      codigoPostal: { type: String, default: "44266" },
    },
  })
  Direccion: {
    Pais: string;
    Ciudad: string;
    codigoPostal: string;
  };

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: {
      a_tiempo: { type: Number, default: 0 },
      fuera_tiempo: { type: Number, default: 0 },
    },
    default: { a_tiempo: 0, fuera_tiempo: 0 },
  })
  Tickets_resueltos: {
    a_tiempo: number;
    fuera_tiempo: number;
  };

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Celula', default: [] })
  Celula: Celula[];
}

export type UserDocument = Usuarios & Document;
export const UserSchema = SchemaFactory.createForClass(Usuarios);
