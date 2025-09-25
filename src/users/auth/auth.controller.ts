import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { UserService } from '../users.service';
import { CreateUserDto } from '../models/create-user.dto';
import { User } from '../users.entity';
import { Public } from '../decorators/public.decorator';
import { LoginDto } from '../models/login.dto';
import { LoginResponse } from '../models/login.response';
import { AuthRequest } from '../models/auth.request';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @Public()
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.authService.register(createUserDto);
    return user;
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const accessToken = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    return new LoginResponse({ accessToken });
  }

  @Get('/profile')
  async profile(@Request() request: AuthRequest): Promise<User> {
    console.log('request', request);

    const user = await this.userService.findOne(request.user.sub);
    if (user) {
      return user;
    }

    throw new NotFoundException();
  }
}
