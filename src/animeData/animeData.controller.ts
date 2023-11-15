import { Controller, Get, Param, Query, Headers } from '@nestjs/common';
import Scraper from '../utils/scraper';
import { UserService } from 'src/user/user.service';

@Controller()
export class AnimeDataController {
  constructor(private userService: UserService) {}

  @Get('popular/:page')
  async getPopular(
    @Param('page') page,
    @Headers('token') token,
  ): Promise<string> {
    if (!(await this.userService.checkToken(token)))
      return 'You must be logged in to use our services';

    return Scraper.popular(page);
  }

  @Get('a/:id')
  async getAnime(@Param('id') id, @Headers('token') token): Promise<string> {
    if (!(await this.userService.checkToken(token)))
      return 'You must be logged in to use our services';

    let seenData = await this.userService.getUserSeen_filter(token, id);
    return Scraper.anime(id, seenData);
  }

  @Get('a/:id/:ep')
  async getAnimeEpisode(
    @Param('id') id,
    @Param('ep') ep,
    @Headers('token') token,
  ): Promise<string> {
    if (!(await this.userService.checkToken(token)))
      return 'You must be logged in to use our services';

    await this.userService.pushSeen(token, { anime: id, episodes: ep });
    return Scraper.episode(id, ep);
  }

  @Get('search/')
  async getSearchResults(
    @Query('search_str') searchStr,
    @Headers('token') token,
  ): Promise<string> {
    if (!(await this.userService.checkToken(token)))
      return 'You must be logged in to use our services';
    return Scraper.search(searchStr);
  }
}
