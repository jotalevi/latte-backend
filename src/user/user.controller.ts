import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { UserLoginDto } from './dto/UserLogin.dto';
import { UserCreateDto } from './dto/UserCreate.dto';
import { UserDataDto, SeenAnimeEp } from './dto/UserData.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('u/:token')
  async getUserData(@Param('token') token: string): Promise<UserDataDto | any> {
    return await this.userService.getUserData(token);
  }

  @Get('u/invite/:token')
  async getInviteUrl(@Param('token') token: string): Promise<string | any> {
    return await this.userService.getInviteToken(token);
  }

  @Post('u/login')
  async loginUser(@Body() data: UserLoginDto): Promise<string | any> {
    return await this.userService.loginUser(data);
  }

  @Post('u/register')
  async registerUser(@Body() data: UserCreateDto): Promise<string | any> {
    return await this.userService.registerUser(data);
  }

  @Get('u/favs/:token')
  async getFavs(@Param('token') token: string): Promise<string | any> {
    return await this.userService.getUserFavs(token);
  }

  @Post('u/favs/:token')
  async setFavs(
    @Param('token') token: string,
    @Body('id') animeId: string,
  ): Promise<string | any> {
    return await this.userService.pushFavs(token, animeId);
  }

  @Get('u/seen/:token')
  async getSeen(@Param('token') token: string): Promise<string | any> {
    return await this.userService.getUserSeen(token);
  }

  @Post('u/seen/:token')
  async setSeen(
    @Param('token') token: string,
    @Body() seenData: SeenAnimeEp,
  ): Promise<string | any> {
    return await this.userService.pushSeen(token, seenData);
  }
}
