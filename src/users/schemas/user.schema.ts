import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Rol } from './rol.schema';
import { Area } from './area.schema';

@Schema({ collection: 'Usuarios', versionKey: false })
export class Usuarios {
  @Prop({ required: true })
  Username?: string;
  @Prop({ required: true })
  Password: string;
  @Prop({ required: true })
  Nombre: string;
  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rol' }],
  })
  Rol: Rol[];
  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Area' }],
  })
  Area: Area[];
  @Prop({ required: true })
  Correo: string;
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
}

export const UserSchema = SchemaFactory.createForClass(Usuarios);
