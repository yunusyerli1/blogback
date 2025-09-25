import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users.service';
import { CreateUserDto } from '../models/create-user.dto';
import { PasswordService } from '../password.service';
import { User } from '../users.entity';



@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  public async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userService.findOneByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.userService.createUser(createUserDto);

    // 1) Return the user
    // 2) Return the user & token
    // 3) Return the token

    return user;
  }

  public async login(email: string, password: string): Promise<string> {
    const user = await this.userService.findOneByEmail(email);

    console.log("user", user)

    // 1) Theres no such user
    // 2) Password is invalid
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(await this.passwordService.verify(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private generateToken(user: User): string {
    console.log("user in token", user)
    const payload = { sub: user.id, name: user.name };
    return this.jwtService.sign(payload);
  }
  
}

// 1) User registration
//    - Make sure does not exist yet
//    - Store the user
//    - (optional) generate the token
// 2) Generating token