import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuarios, UserSchema } from './schemas/user.schema';
import { Area, AreaSchema } from './schemas/area.schema';
import { Rol, RolSchema } from './schemas/rol.schema';
import {
  DireccionGeneral,
  DireccionGeneralSchema,
} from './schemas/direccion_general.schema';
import { Dependencia, DependenciaSchema } from './schemas/dependencia.schema';
import { CelulaSchema, Celula } from './schemas/celula.schema';
import { Puesto, PuestoSchema } from './schemas/puestos.schema';
import { Logs, LogsSchema } from './schemas/log.schema';
import { LogsService } from 'src/services/logs.service';
import { RedisPublisher } from 'src/redis/redis.publisher';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usuarios.name, schema: UserSchema },
      { name: Area.name, schema: AreaSchema },
      { name: Rol.name, schema: RolSchema },
      { name: DireccionGeneral.name, schema: DireccionGeneralSchema },
      { name: Dependencia.name, schema: DependenciaSchema },
      { name: Celula.name, schema: CelulaSchema },
      { name: Puesto.name, schema: PuestoSchema },
      { name: Logs.name, schema: LogsSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, LogsService, RedisPublisher],
  exports: [LogsService],
})
export class UsersModule {}
