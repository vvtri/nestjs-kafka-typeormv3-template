import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EachMessagePayload } from 'kafkajs';
import { Repository } from 'typeorm';
import { SubscribeTo } from '../../common/decorators/subcribe-to.decorator';
import { Topic } from '../../message-broker/enums/topic.enum';
import { Producer } from '../../message-broker/producer.service';
import { RegisterUserReqDto } from '../dtos/req/register-user.req.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @Inject(Producer) private producer: Producer,
  ) {}

  @SubscribeTo('USER_REGISTRATION', UserService)
  subcribe(data: EachMessagePayload) {
    console.log('this :>> ', (this != null));
    console.log('data :>> ', data);
  }

  async register(dto: RegisterUserReqDto) {
    const { email, password } = dto;
    const user = this.userRepo.create({ email, password });

    await this.userRepo.save(user);

    const result = await this.producer.send(
      Topic.USER_REGISTRATION,
      { ...user },
      100002,
    );

    console.log('result :>> ', result);

    return user;
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }
}
