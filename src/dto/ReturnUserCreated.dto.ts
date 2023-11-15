import { ReturnSeenAnimeEps } from './ReturnUserData.dto';

export class ReturnUserCreatedDto {
  id: string;
  username: string;
  mail: string;
  invites_left: number;
  seen: ReturnSeenAnimeEps[];
  favs: string[];
}
