export class UserDataDto {
  username: string;
  seen: SeenAnimeEp[];
  favs: string[];
}

export class SeenAnimeEp {
  anime: string;
  episodes: string[];
}
