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
import { RolesGuard } from 'src/auth/jwt-roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
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
<<<<<<< HEAD
  async create(@Body() createUserDto: CreateUserDto, @Token() token: string) {
    console.log(createUserDto)
    return await this.usersService.create(createUserDto, token);
=======
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
>>>>>>> d2f9b1d48174fe14f5ff4c89312b853b9780826b
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
  async getInfoSelectsUsuarios() {
    return await this.usersService.getInfoSelectsUsuarios();
  }

  @Get('perfil')
  async getPerfil(@Req() req: any) {
    const { userId } = req.user;
    return await this.usersService.getPerfil(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch('/perfil/:id')
  async updatePerfil(
    @Param('id') id: string,
    @Body()
    body: {
      Nombre: string;
      Telefono: string;
      Extension: string;
      Ubicacion: string;
    },
  ) {
    return await this.usersService.updatePerfil(id, body);
  }

  @Patch('/editar/:id')
<<<<<<< HEAD
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Token() token: string) {
    return await this.usersService.update(id, updateUserDto, token);
  }

  @Patch('/estado/:id')
  async updateEstadoUsuario(@Param('id') id: string, @Body() estadoUsuario: { estado: boolean }, @Token() token: string) {
=======
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Patch('/estado/:id')
  async updateEstadoUsuario(
    @Param('id') id: string,
    @Body() estadoUsuario: { estado: boolean },
  ) {
>>>>>>> d2f9b1d48174fe14f5ff4c89312b853b9780826b
    const { estado } = estadoUsuario;
    return await this.usersService.updateEstadoUsuario(id, estado, token);
  }

  @Patch('/changepassword/:id')
  async changePassword(
    @Param('id') id: string,
    @Body() body: { Password: string; newPassword: string },
  ) {
    const { Password, newPassword } = body;
    return await this.usersService.changePassword(id, Password, newPassword);
  }
}
