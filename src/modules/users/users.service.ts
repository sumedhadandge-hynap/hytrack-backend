import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const { password, ...userData } = createUserDto;
    const password_hash = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      ...userData,
      password_hash,
    });

    return this.userRepo.save(user);
  }

  async findAll() {
    return this.userRepo.find({
      select: ['id', 'first_name', 'last_name', 'email', 'is_active', 'created_at'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      select: ['id', 'first_name', 'last_name', 'email', 'is_active', 'created_at'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    
    if (updateUserDto.password) {
      const { password, ...rest } = updateUserDto;
      (user as any).password_hash = await bcrypt.hash(password, 10);
      Object.assign(user, rest);
    } else {
      Object.assign(user, updateUserDto);
    }

    return this.userRepo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepo.remove(user);
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }
}