import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'Area' })
export class Area {
  @Prop({ required: true })
  Area: string;
}

export const AreaSchema = SchemaFactory.createForClass(Area);
