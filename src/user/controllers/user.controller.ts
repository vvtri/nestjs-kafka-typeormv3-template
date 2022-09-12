import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { RegisterUserReqDto } from '../dtos/req/register-user.req.dto';
import { UserService } from '../services/user.service';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  register(@Body() body: RegisterUserReqDto) {
    return this.userService.register(body);
  }

  @Get('')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }
}
