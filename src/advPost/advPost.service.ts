import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AdvPost } from './advPost.schema';
import { CreateAdvPostDto } from 'src/dto/CreateAdvPost.dto';
import { ReturnAdvPostDto } from 'src/dto/returnAdvPost.dto';
import { EditAdvPostDto } from 'src/dto/EditAdvPost.dto';
import ReturnListAdvPostDto from 'src/dto/ReturnListAdvPost.dto';

@Injectable()
export class AdvPostService {
  constructor(
    @InjectModel(AdvPost.name) private advPostModel: Model<AdvPost>,
  ) {}

  async postAdv(data: CreateAdvPostDto): Promise<ReturnAdvPostDto> {
    let advPost = await this.advPostModel.create(data);
    await advPost.save();

    return advPost as ReturnAdvPostDto;
  }

  async putAdv(data: EditAdvPostDto): Promise<ReturnAdvPostDto> {
    let advPost = await this.advPostModel.findOne({ id: data.id });

    advPost.title = data.title ?? advPost.title;
    advPost.is_title_image = data.is_title_image ?? advPost.is_title_image;
    advPost.short = data.short ?? advPost.short;
    advPost.description = data.description ?? advPost.description;
    advPost.link_to = data.link_to ?? advPost.link_to;
    advPost.media_url = data.media_url ?? advPost.media_url;
    advPost.active = data.active ?? advPost.active;

    await advPost.save();

    return advPost as ReturnAdvPostDto;
  }

  async getAdv(): Promise<ReturnListAdvPostDto> {
    let returnable = {
      count: 0,
      items: await this.advPostModel.find({}),
    };

    returnable.count = returnable.items.length;

    return returnable as ReturnListAdvPostDto;
  }

  async getAnnouncements(max: number): Promise<ReturnListAdvPostDto> {
    let returnable = {
      count: 0,
      items: await this.advPostModel.find({ active: true }),
    };

    if (max < returnable.items.length)
      returnable.items = returnable.items.slice(0, max);

    returnable.count = returnable.items.length;

    return returnable as ReturnListAdvPostDto;
  }
}
