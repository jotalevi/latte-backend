import axios from 'axios';
import cheerio from 'cheerio';
import config from './configs';
import { parse, stringify } from 'flatted';

class Scraper {
  static popular = async (page): Promise<string> => {
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

    items.each(function (idx, el) {
      let anime = {
        id: '',
        thumbnail: '',
        title: '',
      };
      anime.id = $(el)
        .children()
        .children()
        .attr('href')
        .replace('/category/', '');
      anime.thumbnail = $(el).children().children().children().attr('src');
      anime.title = $(el).children('.name').children().text();
      resContent.results.push(anime);
    });

    return JSON.stringify(resContent);
  };

  static anime = async (anime_id): Promise<string> => {
    let resContent = {
      anime: anime_id,
      og_title: '',
      og_image: '',
      info: '',
      seen: [],
      title: '',
      thumbnail: '',
      type: '',
      episodes: [],
    };

    const { data } = await axios.get(
      `${config.scrape_url}${config.rule_path.anime}${anime_id}`,
    );
    const $ = cheerio.load(data);
    const animeInfo = $('.anime_info_body_bg');

    resContent.title = animeInfo.children('h1').text();
    resContent.thumbnail = animeInfo.children('img').attr('src');

    let aInfoTag = animeInfo.children('.type');
    console.log();
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

    return JSON.stringify(resContent);
  };

  static episode = async (anime_id, episode_id): Promise<string> => {
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
    resContent.media_url = $('iframe').attr('src').toString();

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

    return JSON.stringify(resContent);
  };

  static search = async (query_str): Promise<string> => {
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
    return JSON.stringify(resContent);
  };
}

export default Scraper;
