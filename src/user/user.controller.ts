import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { UserLoginDto } from './dto/UserLogin.dto';
import { User } from './user.entity';
import { UserCreateDto } from './dto/UserCreate.dto';
import { UserDataDto, SeenAnimeEp } from './dto/UserData.dto';

@Controller()
export class UserController {
  constructor() {}

  @Get('u/:token')
  async getUserData(@Param('token') token: string): Promise<UserDataDto | any> {
    let user = await User.findBytoken(token);

    if (!user)
      return {
        message: 'No user found with this ID',
        status: 401,
      };

    let returnable = new UserDataDto();

    returnable.favs = user.getFavs();
    returnable.seen = user.getSeen();
    returnable.username = user.getUsername();

    return returnable;
  }

  @Post('u/login')
  async loginUser(@Body() data: UserLoginDto): Promise<string | any> {
    let user = await User.findByUsername(data.username);
    let result = user.proofPass(data.password);

    return {
      message: result,
      id: user.getId(),
      status: result ? '200' : 403,
    };
  }

  @Post('u/register')
  async registerUser(@Body() data: UserCreateDto): Promise<string | any> {
    let user = User.create();
    user.setFavs([]);
    user.setSeen([]);
    user.setMail(data.mail);
    user.setUsername(data.username);
    user.setPassword(data.password);
    await user.save();
    return {
      message: 'User created',
      status: 200,
    };
  }

  @Post('getFavs')
  getFavs() {}

  @Post('setFavs')
  setFavs() {}

  @Post('getSeen')
  getSeen() {}

  @Post('setSeen')
  setSeen() {}
}
