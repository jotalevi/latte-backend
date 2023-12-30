import axios from 'axios';
import cheerio from 'cheerio';
import config from './configs';
import { parse, stringify } from 'flatted';
import { ReturnPopularDto } from 'src/dto/ReturnPopular.dto';
import { ReturnAnimeDto } from 'src/dto/ReturnAnime.dto';
import { ReturnEpisodeDto } from 'src/dto/ReturnEpisode.dto';
import { ReturnSearchResultDto } from 'src/dto/ReturnSearchResult.dto';
import {
  ReturnSeenAnimeEps,
  ReturnUserDataDto,
} from 'src/dto/ReturnUserData.dto';
import { ReturnHomePageDto } from 'src/dto/ReturnHomePage.dto';
import ScrapeCache from './ScrapeCache/ScrapeCache';

const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

class Scraper {
  static homepage = async (
    userData: ReturnUserDataDto,
  ): Promise<ReturnHomePageDto> => {
    let resContent = {
      og_title: 'Watch anime for free on UnLatte',
      og_image: '',
      results: [],
      bookmark: [],
      continue: [],
    };

    const getContinueFromIdList = async (
      anime: ReturnSeenAnimeEps[],
      userSeen: ReturnSeenAnimeEps[],
    ): Promise<ReturnAnimeDto[]> => {
      let results = [];
      let ids = [];

      for (const tl of anime) {
        ids.push(tl.anime);
        results.push(
          Scraper.anime(
            tl.anime,
            userSeen.filter((seen: ReturnSeenAnimeEps) => {
              return seen.anime === tl.anime;
            }),
          ),
        );
      }

      return await Promise.all(results);
    };

    const getBookmarkFromIdList = async (
      ids: string[],
      userSeen: ReturnSeenAnimeEps[],
    ): Promise<ReturnAnimeDto[]> => {
      let results = [];

      for (const id of ids) {
        results.push(
          await Scraper.anime(
            id,
            userSeen.filter((seen: ReturnSeenAnimeEps) => {
              return seen.anime === id;
            }),
          ),
        );
      }

      return await Promise.all(results);
    };

    let bookmarkJob = getBookmarkFromIdList(userData.favs, userData.seen);
    let continueJob = getContinueFromIdList(userData.seen, userData.seen);

    resContent.results = (await this.popular(1)).results;
    resContent.bookmark = await bookmarkJob;
    resContent.continue = await continueJob;

    return resContent;
  };

  static popular = async (page: number): Promise<ReturnPopularDto> => {
    let cache = ScrapeCache.get('popular', [
      {
        paramName: 'page',
        paramValue: page.toString(),
      },
    ]);

    if (cache) {
      return cache as ReturnPopularDto;
    }

    let resContent = {
      page: page ?? 1,
      og_title: 'Watch anime for free on UnLatte',
      og_image: '',
      results: [],
    };

    const { data } = await axios.get(
      `${config.scrape_url}${config.rule_path.popular}${resContent.page}`,
    );

    const $ = cheerio.load(data);
    const items = $('.items>li');

    for (const el of items) {
      resContent.results.push(
        await Scraper.anime(
          $(el)
            .children()
            .children()
            .attr('href')
            .replace('/category/', '')
            .replace('/watch/', ''),
          [],
        ),
      );
    }

    ScrapeCache.cache(
      'popular',
      [
        {
          paramName: 'page',
          paramValue: page.toString(),
        },
      ],
      resContent,
    );

    return resContent;
  };

  static anime = async (
    anime_id: string,
    userSeenData: ReturnSeenAnimeEps[],
  ): Promise<ReturnAnimeDto> => {
    let resContent = {
      anime: anime_id,
      og_title: '',
      og_image: '',
      info: '',
      seen: userSeenData,
      title: '',
      thumbnail: '',
      type: '',
      episodes: [],
    };
    let cache = ScrapeCache.get('anime', [
      {
        paramName: 'anime_id',
        paramValue: anime_id,
      },
    ]);

    if (cache) {
      console.log('there is cache for anime ' + anime_id);
      cache['seen'] = userSeenData;
      return cache as ReturnAnimeDto;
    }

    const { data } = await axios.get(
      `${config.scrape_url}${config.rule_path.anime}${anime_id}`,
    );
    const $ = cheerio.load(data);
    const animeInfo = $('.anime_info_body_bg');

    resContent.title = animeInfo.children('h1').text();
    resContent.thumbnail = animeInfo.children('img').attr('src');

    let aInfoTag = animeInfo.children('.type');

    resContent.type = parse(stringify(aInfoTag[0].children[2])).attribs.title;
    resContent.info = parse(stringify(aInfoTag[1].children[1])).data;

    const animeEpCounter = $('#episode_page');
    let epCounter = parseInt(
      animeEpCounter.children('li').last().text().split('-')[1],
    );

    resContent.episodes = [];
    for (let i = 1; i <= epCounter; i++) {
      resContent.episodes.push(`${i}`);
    }

    resContent.og_title = `Whatch ${resContent.title} for free on Latte`;
    resContent.og_image = resContent.thumbnail;

    ScrapeCache.cache(
      'anime',
      [
        {
          paramName: 'anime_id',
          paramValue: anime_id,
        },
      ],
      resContent,
    );

    return resContent;
  };

  static getCleanMediaUrl = async (mediaUrl: string): Promise<string> => {
    let donwloadUrl = `https://goone.pro/download?id=${
      mediaUrl.split('streaming.php?id=')[1].split('&')[0]
    }`;

    let returnableUrl = '';
    let driver = await new Builder()
      .forBrowser(Browser.FIREFOX)
      .setFirefoxOptions(new firefox.Options().headless())
      .build();
    try {
      await driver.get(donwloadUrl);
      for (let i = 1; i <= 50; i++) {
        try {
          let mediaA = await driver
            .findElement(
              By.xpath(
                `/html/body/section/div/div[2]/div/div[4]/div[1]/div[${i}]/a`,
              ),
            )
            .getAttribute('href');
          returnableUrl = mediaA;
        } catch {
          break;
        }
      }
    } finally {
      await driver.quit();
    }

    return returnableUrl;
  };

  static episode = async (
    anime_id: string,
    episode_id: string,
  ): Promise<ReturnEpisodeDto> => {
    let cache = ScrapeCache.get('episode', [
      {
        paramName: 'anime_id',
        paramValue: anime_id,
      },
      {
        paramName: 'episode_id',
        paramValue: episode_id,
      },
    ]);

    //if (cache) {
    //  return cache as ReturnEpisodeDto;
    //}

    let resContent = {
      anime: anime_id,
      episode: episode_id,
      og_image: '',
      og_title: '',
      title: '',
      media_url: '',
      previousEp: '',
      nextEp: '',
    };

    const { data } = await axios.get(
      `${config.scrape_url}${config.rule_path.episode}${anime_id}-episode-${episode_id}`,
    );
    const $ = cheerio.load(data);

    resContent.title = $('.anime_video_body').children('h1').text();
    resContent.og_title = resContent.title;
    resContent.media_url = await this.getCleanMediaUrl(
      $('iframe').attr('src').toString(),
    );

    let pvfContent = '_';
    try {
      let previousEpFullRefList = $('.anime_video_body_episodes_l')
        .children('a')
        ['0'].attribs.href.split('/');
      pvfContent = previousEpFullRefList[previousEpFullRefList.length - 1];
    } catch (e) {
      console.log(e);
    } finally {
      resContent.previousEp = pvfContent.split('-').slice(-1)[0];
    }

    let nxtContent = '_';
    try {
      let nextEpFullRefList = $('.anime_video_body_episodes_r')
        .children('a')
        ['0'].attribs.href.split('/');
      nxtContent = nextEpFullRefList[nextEpFullRefList.length - 1];
    } catch (e) {
      console.log(e);
    } finally {
      resContent.nextEp = nxtContent.split('-').slice(-1)[0];
    }

    ScrapeCache.cache(
      'episode',
      [
        {
          paramName: 'anime_id',
          paramValue: anime_id,
        },
        {
          paramName: 'episode_id',
          paramValue: episode_id,
        },
      ],
      resContent,
    );

    return resContent;
  };

  static search = async (query_str: string): Promise<ReturnSearchResultDto> => {
    let resContent = {
      query: query_str,
      og_title: "Results for ' " + query_str + "' on UnLatte",
      og_image: 'https://unlatte.cl/image/preview.png',
      matches: 0,
      results: [],
    };
    const { data } = await axios.get(
      `${config.scrape_url}${config.rule_path.search}${query_str}`,
    );
    const $ = cheerio.load(data);

    const items = $('.items>li');
    let rslist = [];
    items.each(function (idx, el) {
      let anime = {};
      anime['id'] = $(el)
        .children()
        .children()
        .attr('href')
        .replace('/category/', '');
      anime['thumbnail'] = $(el).children().children().children().attr('src');
      anime['title'] = $(el).children('.name').children().text();
      rslist.push(anime);
    });
    resContent.results = rslist;
    resContent.matches = resContent.results.length;

    let resFilterHandle = [];
    resContent.results.forEach((animeInResult) => {
      let unique = true;
      resFilterHandle.forEach((animeInFiltered) => {
        if (animeInFiltered.id === animeInResult.id) {
          unique = false;
        }
      });
      if (unique) resFilterHandle.push(animeInResult);
    });
    resContent.results = resFilterHandle;
    return resContent;
  };
}

export default Scraper;
