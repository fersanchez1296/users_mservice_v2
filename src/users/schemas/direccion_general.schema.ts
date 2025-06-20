import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'Direccion_general' })
export class DireccionGeneral{
  @Prop({ required: true })
  Direccion_General: string;
}

export const DireccionGeneralSchema = SchemaFactory.createForClass(DireccionGeneral);