import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './models/create-user.dto';
import { PasswordService } from './password.service';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly passwordService: PasswordService,
    ) { }

    // 1) find the user by email
    // 2) create user
    // 3) fetch the user by id
    public async findOneByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOneBy({ email });
    }

    public async createUser(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await this.passwordService.hash(
            createUserDto.password,
        );
        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });

        return await this.userRepository.save(user);
    }

    public async findOne(id: string): Promise<User | null> {
        return await this.userRepository.findOneBy({ id });
    }
}