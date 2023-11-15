import { PopularItemDto } from './PopularItem.dto';

export class ReturnSearchResultDto {
  query: string;
  og_title: string;
  og_image: string;
  matches: number;
  results: PopularItemDto[];
}
