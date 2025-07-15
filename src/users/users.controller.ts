import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GenerateUserInterceptor } from 'src/interceptors/generate-user.interceptor';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/jwt-roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { GeneratePasswordInterceptor } from 'src/interceptors/generate-password.interceptor';
import { Token } from 'src/decorators/token.decorator';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({ summary: 'Crea un nuevo usuario' })
  @UseInterceptors(GenerateUserInterceptor, GeneratePasswordInterceptor)
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Token() token: string) {
    console.log(createUserDto)
    return await this.usersService.create(createUserDto, token);
  }

  @ApiOperation({ summary: 'Obtiene todos los usuarios de la base de datos' })
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('/celulas')
  async usuariosConCelulas() {
    return await this.usersService.usuariosConCelulas();
  }

  @Get('/getInfoSelectsUsuarios')
  getInfoSelectsUsuarios() {
    return this.usersService.getInfoSelectsUsuarios();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch('/editar/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Token() token: string) {
    return await this.usersService.update(id, updateUserDto, token);
  }

  @Patch('/estado/:id')
  async updateEstadoUsuario(@Param('id') id: string, @Body() estadoUsuario: { estado: boolean }, @Token() token: string) {
    const { estado } = estadoUsuario;
    return await this.usersService.updateEstadoUsuario(id, estado, token);
  }
}
