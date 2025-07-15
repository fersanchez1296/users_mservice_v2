import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuarios } from './schemas/user.schema';
import { Model } from 'mongoose';
import { Area } from './schemas/area.schema';
import { DireccionGeneral } from './schemas/direccion_general.schema';
import { Rol } from './schemas/rol.schema';
import { populateUsers } from 'src/common/utils/populateUsers.util';
import { Dependencia } from './schemas/dependencia.schema';
import { Celula } from './schemas/celula.schema';
import { Puesto } from './schemas/puestos.schema';
import { LogsService } from 'src/services/logs.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Usuarios.name) private readonly userModel: Model<Usuarios>,
    @InjectModel(Area.name) private readonly areaModel: Model<Area>,
    @InjectModel(Rol.name) private readonly rolModel: Model<Rol>,
    @InjectModel(DireccionGeneral.name)
    private readonly dGeneral: Model<DireccionGeneral>,
    @InjectModel(Dependencia.name)
    private readonly dependenciaModel: Model<Dependencia>,
    private readonly logsService: LogsService,
    @InjectModel(Celula.name) private readonly celulaModel: Model<Celula>,
    @InjectModel(Puesto.name) private readonly puestoModel: Model<Puesto>,
  ) { }

  async create(createUserDto: CreateUserDto, token: string) {
    try {
      const newUser = await this.userModel.create(createUserDto);
      const data = { Username: newUser.Username, destinatario: newUser.Correo }
      if (newUser) {
        const savedlog = await this.logsService.enviarLog(data, "usuarioCreado", token);
        return newUser;
      }
    } catch (error) {
      const savedlog = await this.logsService.enviarLog({ Nombre: createUserDto.Nombre }, "usuarioNoCreado", token, error);
      throw new InternalServerErrorException("Error interno en el servidor: Error al crear al usuario");
    }
  }

  async findAll() {
    try {
      const result = await this.userModel.find();

      if (!result) {
        throw new NotFoundException('No se encontraron usuarios.');
      }

      const populatedResult = await populateUsers(result);

      if (!populatedResult) {
        throw new BadRequestException(
          'Ocurrio un error al formatear la informacion de los usuarios',
        );
      }

      return populatedResult;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Ocurrio un error al formatear a los usuarios.',
      );
    }
  }

  async usuariosConCelulas() {
    try {
      const result = await this.userModel
        .find({ Celula: { $ne: [] } })
        .sort({ Nombre: 1 });

      if (!result) {
        throw new NotFoundException('No se encontraron usuarios.');
      }

      const populatedResult = await populateUsers(result);

      if (!populatedResult) {
        throw new BadRequestException(
          'Ocurrio un error al formatear la informacion de los usuarios',
        );
      }

      return populatedResult;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Ocurrio un error al formatear a los usuarios.',
      );
    }
  }

  async findOne(id: string) {
    return this.userModel
      .findById({ _id: id })
      .populate({ path: 'Rol', model: 'Rol' })
      .populate({ path: 'Area', model: 'Area' });
  }

  async update(id: string, updateUserDto: any, token: string) {
    try {
      const userUpdated = await this.userModel.findOneAndUpdate({ _id: id }, { $set: updateUserDto });
      const data = { Username: userUpdated?.Username, destinatario: userUpdated?.Correo }
      if (userUpdated) {
        const savedlog = await this.logsService.enviarLog(data, "usuarioactualizado", token);
        return { message: "La información del usuario fue actualizada con exito" };
      } else {
        throw new BadRequestException("Ocurrió un error al actualizar la información del usuario.")
      }
    } catch (error) {
      const savedlog = await this.logsService.enviarLog({ Nombre: updateUserDto.Nombre }, "usuarioNoactualizado", token, error);
      throw new InternalServerErrorException("Error interno en el servidor: Ocurrió un error al actualizar la información del usuario.")
    }
  }

  async updateEstadoUsuario(id: string, estado: boolean, token: string) {
    try {
      const usuario = await this.userModel.findById(id);
      const result = await this.userModel.updateOne({ _id: id }, { $set: { isActive: estado } });
      const data = { message: "El estado del usuario fue actualizado con exito.", Username: usuario?.Username }
      if (result) {
        const savedlog = await this.logsService.enviarLog(data, "estadoActualizado", token);
      } else {
        const savedlog = await this.logsService.enviarLog(data, "estadoNoActualizado", token);
        throw new BadRequestException("Ocurrió un error al actualizar la información del usuario.")
      }
    } catch (error) {
      const savedlog = await this.logsService.enviarLog({ message: "Ocurrio un error al actualizar el estado del usuario." }, "usuarioactualizado", token);
      throw new InternalServerErrorException("Error interno en el servidor: Ocurrió un error al actualizar la información del usuario.")
    }

  }

  async getInfoSelectsUsuarios() {
    try {
      const [areas, roles, dgenerales, celulas, puestos] = await Promise.all([
        this.areaModel.find().sort({ Area: 1 }),
        this.rolModel.find().sort({ Rol: 1 }),
        this.dGeneral.find().sort({ Direccion_General: 1 }),
        this.celulaModel.find().sort({ Celula: 1 }),
        this.puestoModel.find().sort({ Puesto: 1 }),
      ]);

      const groupedAreas = areas.map((a) => ({
        label: a.Area,
        value: a._id,
      }));

      const groupedRoles = roles.map((r) => ({
        label: r.Rol,
        value: r._id,
      }));

      const groupedDGenerales = dgenerales.map((r) => ({
        label: r.Direccion_General,
        value: r._id,
      }));

      const groupedCelulas = celulas.map((r) => ({
        label: r.Celula,
        value: r._id,
      }));

      const groupedPuestos = puestos.map((r) => ({
        label: r.Puesto,
        value: r._id,
      }));

      return {
        areas: groupedAreas,
        roles: groupedRoles,
        dGenerales: groupedDGenerales,
        celulas: groupedCelulas,
        puestos: groupedPuestos
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrio un error al obtener la informacion para los select de los usuarios',
      );
    }
  }
}
