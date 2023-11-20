import { ReturnAnimeDto } from './ReturnAnime.dto';

export class ReturnHomePageDto {
  og_title: string;
  og_image: string;
  results: ReturnAnimeDto[];
  bookmark: ReturnAnimeDto[];
  continue: ReturnAnimeDto[];
}
