import { PopularItemDto } from './PopularItem.dto';

export class ReturnPopularDto {
  page: number;
  og_title: string;
  og_image: string;
  results: PopularItemDto[];
}
