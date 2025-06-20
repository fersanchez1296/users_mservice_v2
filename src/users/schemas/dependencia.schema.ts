import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'Dependencia' })
export class Dependencia{
  @Prop({ required: true })
  Dependencia: string;
}

export const DependenciaSchema = SchemaFactory.createForClass(Dependencia);