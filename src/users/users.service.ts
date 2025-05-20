import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuarios } from './schemas/user.schema';
import { Model } from 'mongoose';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Usuarios.name) private readonly userModel: Model<Usuarios>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.userModel.create(createUserDto);
    return newUser;
  }

  async findAll() {
    return this.userModel.find();
  }

  async findOne(id: string) {
    return this.userModel
      .findById({ _id: id })
      .populate({ path: 'Rol', model: 'Rol' })
      .populate({ path: 'Area', model: 'Area' });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({ _id: id }, updateUserDto);
  }
}
