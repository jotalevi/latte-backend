import {
  Controller,
  Get,
  Headers,
  Query,
  Post,
  Body,
  Put,
} from '@nestjs/common';
import { AdvPostService } from './advPost.service';
import { ReturnErrorDto } from 'src/dto/ReturnError.dto';
import { UserService } from 'src/user/user.service';
import { UserRoles } from 'src/enum/userRoles.enum';
import { ReturnAdvPostDto } from 'src/dto/returnAdvPost.dto';
import { CreateAdvPostDto } from 'src/dto/CreateAdvPost.dto';
import { EditAdvPostDto } from 'src/dto/EditAdvPost.dto';
import ReturnListAdvPostDto from 'src/dto/ReturnListAdvPost.dto';

@Controller()
export class AdvPostController {
  constructor(
    private advPostService: AdvPostService,
    private userService: UserService,
  ) {}

  @Post('adv')
  async postAdv(
    @Body() data: CreateAdvPostDto,
    @Headers('Authorization') token: string,
  ): Promise<ReturnAdvPostDto | ReturnErrorDto> {
    if (
      !(await this.userService.checkRole(token.split(' ')[1], UserRoles.ADMIN))
    )
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

    return await this.advPostService.postAdv(data);
  }

  @Put('adv')
  async putAdv(
    @Body() data: EditAdvPostDto,
    @Headers('Authorization') token: string,
  ): Promise<ReturnAdvPostDto | ReturnErrorDto> {
    if (
      !(await this.userService.checkRole(token.split(' ')[1], UserRoles.ADMIN))
    )
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

    return await this.advPostService.putAdv(data);
  }

  @Get('adv')
  async getAdv(
    @Headers('Authorization') token: string,
  ): Promise<ReturnListAdvPostDto | ReturnErrorDto> {
    if (
      !(await this.userService.checkRole(token.split(' ')[1], UserRoles.ADMIN))
    )
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

    return await this.advPostService.getAdv();
  }

  @Get('announces')
  async getActiveAdv(
    @Query('max') max: number = 5,
    @Headers('Authorization') token: string,
  ): Promise<ReturnListAdvPostDto | ReturnErrorDto> {
    if (!(await this.userService.checkToken(token.split(' ')[1])))
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

    return await this.advPostService.getAnnouncements(max);
  }
}
