import { Body, Controller, Post, Get, Headers, Ip } from '@nestjs/common';
import { UserLoginDto } from '../dto/UserLogin.dto';
import { UserCreateDto } from '../dto/UserCreate.dto';
import { SeenAnimeEp } from '../dto/UserData.dto';
import { UserService } from './user.service';
import { ReturnErrorDto } from 'src/dto/ReturnError.dto';
import { ReturnUserDataDto } from 'src/dto/ReturnUserData.dto';
import { ReturnInviteTokenDto } from 'src/dto/ReturnInviteToken.dto';
import { ReturnAuthTokenDto } from 'src/dto/ReturnAuthToken.dto';
import { ReturnUserCreatedDto } from 'src/dto/ReturnUserCreated.dto';
import { ReturnUserFavsDto } from 'src/dto/ReturnUserFavs.dto';
import { ReturnUserSeenDto } from 'src/dto/ReturnUserSeen.dto';
import { RenewUserTokenDto } from 'src/dto/RenewUserToken.dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('u')
  async getUserData(
    @Headers('Authorization') token: string,
  ): Promise<ReturnUserDataDto | ReturnErrorDto> {
    return await this.userService.getUserData(token.split(' ')[1]);
  }

  @Get('u/invite')
  async getInviteUrl(
    @Headers('Authorization') token: string,
  ): Promise<ReturnInviteTokenDto | ReturnErrorDto> {
    return await this.userService.getInviteToken(token.split(' ')[1]);
  }

  @Post('u/login')
  async loginUser(
    @Body() data: UserLoginDto,
    @Ip() ip: string,
  ): Promise<ReturnAuthTokenDto | ReturnErrorDto> {
    return await this.userService.loginUser(data, ip);
  }

  @Post('u/renew')
  async renewUserToken(
    @Body() data: RenewUserTokenDto,
    @Ip() ip: string,
  ): Promise<ReturnAuthTokenDto | ReturnErrorDto> {
    return await this.userService.renewUserToken(data, ip);
  }

  @Post('u/register')
  async registerUser(
    @Body() data: UserCreateDto,
  ): Promise<ReturnUserCreatedDto | ReturnErrorDto> {
    return await this.userService.registerUser(data);
  }

  @Get('u/favs')
  async getFavs(
    @Headers('Authorization') token: string,
  ): Promise<ReturnUserFavsDto | ReturnErrorDto> {
    return await this.userService.getUserFavs(token.split(' ')[1]);
  }

  @Post('u/favs')
  async setFavs(
    @Headers('Authorization') token: string,
    @Body('id') animeId: string,
  ): Promise<ReturnUserFavsDto | ReturnErrorDto> {
    return await this.userService.pushFavs(token.split(' ')[1], animeId);
  }

  @Get('u/seen')
  async getSeen(
    @Headers('Authorization') token: string,
  ): Promise<ReturnUserSeenDto | ReturnErrorDto> {
    return await this.userService.getUserSeen(token.split(' ')[1]);
  }

  @Post('u/seen')
  async setSeen(
    @Headers('Authorization') token: string,
    @Body() seenData: SeenAnimeEp,
  ): Promise<ReturnUserSeenDto | ReturnErrorDto> {
    return await this.userService.pushSeen(token.split(' ')[1], seenData);
  }
}
