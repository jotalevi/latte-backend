export class UserDataDto {
  username: string;
  seen: SeenAnimeEp[];
  favs: string[];
}

export class SeenAnimeEp {
  anime: string;
  episodes: string;
}

export class SeenAnimeEps {
  anime: string;
  episodes: string[];
}
