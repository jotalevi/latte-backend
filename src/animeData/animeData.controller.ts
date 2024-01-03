import { Controller, Get, Param, Query, Headers } from '@nestjs/common';
import Scraper from '../utils/scraper';
import { UserService } from 'src/user/user.service';
import { ReturnErrorDto } from 'src/dto/ReturnError.dto';
import { ReturnPopularDto } from 'src/dto/ReturnPopular.dto';
import { ReturnAnimeDto } from 'src/dto/ReturnAnime.dto';
import { ReturnEpisodeDto } from 'src/dto/ReturnEpisode.dto';
import { ReturnSearchResultDto } from 'src/dto/ReturnSearchResult.dto';
import { ReturnUserSeenDto } from 'src/dto/ReturnUserSeen.dto';
import { ReturnHomePageDto } from 'src/dto/ReturnHomePage.dto';
import { ReturnUserDataDto } from 'src/dto/ReturnUserData.dto';

@Controller()
export class AnimeDataController {
  constructor(private userService: UserService) {}

  @Get('homepage')
  async getHomePage(
    @Headers('Authorization') token: string,
  ): Promise<ReturnHomePageDto | ReturnErrorDto> {
    let userData = await this.userService.getUserData(token.split(' ')[1]);
    if (!userData)
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

    return Scraper.homepage(userData as ReturnUserDataDto);
  }

  @Get('popular/:page')
  async getPopular(
    @Param('page') page: number,
    @Headers('Authorization') token: string,
  ): Promise<ReturnPopularDto | ReturnErrorDto> {
    if (!(await this.userService.checkToken(token.split(' ')[1])))
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

    return Scraper.popular(page);
  }

  @Get('a/:id')
  async getAnime(
    @Param('id') id: string,
    @Headers('Authorization') token: string,
  ): Promise<ReturnAnimeDto | ReturnErrorDto> {
    if (!(await this.userService.checkToken(token.split(' ')[1])))
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

    let seenData = (
      (await this.userService.getUserSeen_filter(
        token.split(' ')[1],
        id,
      )) as ReturnUserSeenDto
    ).seen;

    return Scraper.anime(id, seenData);
  }

  @Get('a/:id/:ep')
  async getAnimeEpisode(
    @Param('id') id: string,
    @Param('ep') ep: string,
    @Param('dev') dev: boolean,
    @Headers('Authorization') token: string,
  ): Promise<ReturnEpisodeDto | ReturnErrorDto> {
    if (!(await this.userService.checkToken(token.split(' ')[1])))
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

    await this.userService.pushSeen(token.split(' ')[1], {
      anime: id,
      episodes: ep,
    });
    return Scraper.episode(id, ep, dev);
  }

  @Get('search/')
  async getSearchResults(
    @Query('search_str') searchStr: string,
    @Headers('Authorization') token: string,
  ): Promise<ReturnSearchResultDto | ReturnErrorDto> {
    if (!(await this.userService.checkToken(token.split(' ')[1])))
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

    return Scraper.search(searchStr);
  }
}
