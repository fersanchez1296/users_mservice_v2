import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuarios, UserSchema } from './schemas/user.schema';
import { Area, AreaSchema } from './schemas/area.schema';
import { Rol, RolSchema } from './schemas/rol.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuarios.name, schema: UserSchema },
      { name: Area.name, schema: AreaSchema },
      { name: Rol.name, schema: RolSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
