import { Controller, Get, Param, Query } from '@nestjs/common';
import Scraper from '../utils/scraper';

@Controller()
export class AnimeDataController {
  constructor() {}

  @Get('popular/:page')
  getPopular(@Param('page') page): Promise<string> {
    return Scraper.popular(page);
  }

  @Get('a/:id')
  getAnime(@Param('id') id): Promise<string> {
    return Scraper.anime(id);
  }

  @Get('a/:id/:ep')
  getAnimeEpisode(@Param('id') id, @Param('ep') ep): Promise<string> {
    return Scraper.episode(id, ep);
  }

  @Get('search/')
  getSearchResults(@Query('search_str') searchStr): Promise<string> {
    return Scraper.search(searchStr);
  }
}
