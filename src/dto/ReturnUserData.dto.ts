export class ReturnUserDataDto {
  username: string;
  seen: ReturnSeenAnimeEps[];
  favs: string[];
}

export class ReturnSeenAnimeEps {
  anime: string;
  episodes: string[];
}
