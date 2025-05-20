import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
@Schema({ collection: 'Roles' })
export class Rol {
  @Prop({ required: true })
  Rol: string;
}

export const RolSchema = SchemaFactory.createForClass(Rol);
