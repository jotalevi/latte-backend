import { ReturnSeenAnimeEps } from './ReturnUserData.dto';

export class ReturnAnimeDto {
  anime: string;
  og_title: string;
  og_image: string;
  info: string;
  seen: ReturnSeenAnimeEps[];
  title: string;
  thumbnail: string;
  type: string;
  episodes: string[];
}
