import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ collection: 'Puestos' })
export class Puesto extends Document {
  @Prop({ required: true })
  Puesto: string;
}

export const PuestoSchema = SchemaFactory.createForClass(Puesto);
