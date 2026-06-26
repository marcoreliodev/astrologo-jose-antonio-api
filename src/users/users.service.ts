import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { uuidv7 } from 'uuidv7';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginateUsersDto } from './dto/paginate-users.dto';
import { Role } from '../common/enums/role.enum';

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectPinoLogger(UsersService.name)
    private readonly logger: PinoLogger,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('E-mail já cadastrado');

    const password = await argon2.hash(dto.password, { type: argon2.argon2id });
    const user = this.usersRepository.create({
      ...dto,
      id: uuidv7(),
      password,
    });
    const saved = await this.usersRepository.save(user);

    this.logger.info(
      { user_id: saved.id, email: saved.email, role: saved.role },
      'Usuário criado',
    );
    return saved;
  }

  async findAll(paginateDto: PaginateUsersDto): Promise<Paginated<User>> {
    const { page, limit } = paginateDto;
    const [data, total] = await this.usersRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findOneWithPassword(id: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const user = await this.findOne(id);
    user.password = await argon2.hash(newPassword, { type: argon2.argon2id });
    await this.usersRepository.save(user);
  }

  async changeOwnPassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.findOneWithPassword(id);

    const valid = await argon2.verify(user.password, currentPassword);
    if (!valid) throw new UnauthorizedException('Senha atual incorreta');

    user.password = await argon2.hash(newPassword, { type: argon2.argon2id });
    await this.usersRepository.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.usersRepository.findOne({
        where: { email: dto.email },
      });
      if (existing) throw new ConflictException('E-mail já cadastrado');
    }

    Object.assign(user, dto);
    const saved = await this.usersRepository.save(user);
    this.logger.info({ user_id: saved.id }, 'Usuário atualizado');
    return saved;
  }

  async updateRole(id: string, role: Role): Promise<User> {
    const user = await this.findOne(id);
    user.role = role;
    const saved = await this.usersRepository.save(user);
    this.logger.info(
      { user_id: saved.id, role: saved.role },
      'Role atualizada',
    );
    return saved;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    this.logger.info({ user_id: id }, 'Usuário removido');
  }
}
