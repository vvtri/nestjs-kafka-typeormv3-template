import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EachMessagePayload } from 'kafkajs';
import { SubscribeTo } from 'src/common/decorators/subcribe-to.decorator';
import { Repository } from 'typeorm';
import { RegisterUserReqDto } from '../dtos/req/register-user.req.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>, ) {}

  async register(dto: RegisterUserReqDto) {
    const { email, password } = dto;
    const user = this.userRepo.create({
      email,
      password,
    });

    return this.userRepo.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  @SubscribeTo('USER_REGISTRATION', UserService)
  subcribe(data: EachMessagePayload) {
    console.log('this :>> ', this);
    console.log('data :>> ', data);
  }
}
