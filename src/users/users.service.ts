import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuarios } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { Area } from './schemas/area.schema';
import { DireccionGeneral } from './schemas/direccion_general.schema';
import { Rol } from './schemas/rol.schema';
import { populateUsers } from 'src/common/utils/populateUsers.util';
import { Dependencia } from './schemas/dependencia.schema';
import { Celula } from './schemas/celula.schema';
import { Puesto } from './schemas/puestos.schema';
import * as bcrypt from 'bcrypt';
import { handleKnownErrors } from 'src/common/utils/handle-known-errors.util';
import { RedisPublisher } from 'src/redis/redis.publisher';
@Injectable()
export class UsersService {
  constructor(
    private readonly redisPublisher: RedisPublisher,
    @InjectModel(Usuarios.name) private readonly userModel: Model<Usuarios>,
    @InjectModel(Area.name) private readonly areaModel: Model<Area>,
    @InjectModel(Rol.name) private readonly rolModel: Model<Rol>,
    @InjectModel(DireccionGeneral.name)
    private readonly dGeneral: Model<DireccionGeneral>,
    @InjectModel(Dependencia.name)
    private readonly dependenciaModel: Model<Dependencia>,
    @InjectModel(Celula.name) private readonly celulaModel: Model<Celula>,
    @InjectModel(Puesto.name) private readonly puestoModel: Model<Puesto>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userModel.create({ ...createUserDto, Password: createUserDto.hashedPassword });
      if (!newUser) throw new UnprocessableEntityException("No se pudo crear al usuario")
      const message = {
        destinatario: newUser.Correo,
        username: newUser.Username,
        nombre: newUser.Nombre,
        password: createUserDto.Password,
      }
      await this.redisPublisher.publish("channel_crearUsuario", message)
      return newUser;
    } catch (error) {
      handleKnownErrors(error, "No se pudo crear al usuario")
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
        throw new UnprocessableEntityException(
          'Ocurrio un error al formatear la informacion de los usuarios',
        );
      }

      return populatedResult;
    } catch (error) {
      handleKnownErrors(error, "No se encontraron usuarios")
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
        throw new UnprocessableEntityException(
          'Ocurrio un error al formatear la informacion de los usuarios',
        );
      }

      return populatedResult;
    } catch (error) {
      handleKnownErrors(error, "No se encontraron usuarios")
    }
  }

  async findOne(id: string) {
    try {
      const result = await this.userModel
        .findById({ _id: id })
        .populate({ path: 'Rol', model: 'Rol' })
        .populate({ path: 'Area', model: 'Area' });

      if (!result) throw new NotFoundException("No se encontró al usuario")

      return result
    } catch (error) {
      handleKnownErrors(error, "No se encontró al usuario")
    }

  }

  async update(id: string, updateUserDto: any) {
    try {
      const userUpdated = await this.userModel.findOneAndUpdate({ _id: id }, { $set: updateUserDto });
      if (!userUpdated) {
        throw new UnprocessableEntityException("Ocurrió un error al actualizar la información del usuario.")
      }
      return { message: "La información del usuario fue actualizada con éxito" };
    } catch (error) {
      handleKnownErrors(error, "Ocurrió un error al actualizar la información del usuario")
    }
  }

  async updateEstadoUsuario(id: string, estado: boolean) {
    try {
      const result = await this.userModel.updateOne({ _id: id }, { $set: { isActive: estado } });

      if (!result) {
        throw new UnprocessableEntityException("Ocurrio un error al actualizar el estado del usuario")
      }

      return { message: "El estado del usuario fue actualizado con exito" };
    } catch (error) {
      handleKnownErrors(error, "No se pudo acutalizar el estado del usuario")
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

  async getPerfil(userId: string) {
    try {
      const result = await this.userModel.findOne(
        { _id: new Types.ObjectId(userId) },
        { Password: 0, Rol: 0 },
      );

      if (!result) throw new NotFoundException("No se encontró la información para el perfil del usuario")

      const populatedResult = await populateUsers([result]);

      if (!populatedResult) throw new UnprocessableEntityException("Ocurrio un error al formatear la informacion del usuario")
      return populatedResult[0];
    } catch (error) {
      handleKnownErrors(error, "No se pudo obtener el perfil de usuario")
    }
  }

  async updatePerfil(userId: string, body: { Nombre: string, Telefono: string, Extension: string, Ubicacion: string }) {
    try {
      const result = await this.userModel.findOneAndUpdate(
        { _id: new Types.ObjectId(userId) },
        { ...body },
      );

      if (!result) throw new BadRequestException("Ocurrió un error al actualizar la información del perfil")

      return { message: "Información actualizada correctamente" }
    } catch (error) {
      handleKnownErrors(error, "No se pudo actualizar el perfil de usuario")
    }
  }

  async changePassword(userId: string, Password: string, newPassword: string) {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) throw new NotFoundException("No se encontró el usuario")

      const isMatch = await bcrypt.compare(Password, user.Password)

      if (!isMatch) throw new BadRequestException("La contraseña actual no es correcta");

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.Password = hashedPassword
      await user.save();

      return { message: "Contraseña cambiada correctamente" }
    } catch (error) {
      handleKnownErrors(error, "No se pudo cambiar la contraseña")
    }
  }
}
