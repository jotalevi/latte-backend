import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { SeenAnimeEp, UserDataDto } from './dto/UserData.dto';
import { UserLoginDto } from './dto/UserLogin.dto';
import { UserCreateDto } from './dto/UserCreate.dto';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { SeenData } from 'src/seenData/seenData.schema';
import { InviteData } from 'src/inviteData/inviteData.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(SeenData.name) private seenDataModel: Model<SeenData>,
    @InjectModel(InviteData.name) private inviteDataModel: Model<InviteData>,
  ) {}

  async checkToken(token: string): Promise<boolean> {
    let user = await this.userModel.findOne({ token: token }).exec();

    if (!user) return false;
    else return true;
  }

  async getUserData(token: string): Promise<UserDataDto | any> {
    let user = await this.userModel.findOne({ token: token }).exec();
    if (!user) return 'invalid token';

    let seenData = await this.seenDataModel.find({ user: user.id }).exec();
    user.seen = seenData;
    return user;
  }

  async getInviteToken(token: string): Promise<string | any> {
    let user = await this.userModel.findOne({ token: token }).exec();

    if (user.invites_left > 0) {
      let inviteData = await this.inviteDataModel.create({
        parent_user: user.id,
        child_user: '',
        token: crypto
          .pbkdf2Sync(
            token.toString() + user.invites_left.toString(),
            user.id,
            1000,
            64,
            `sha512`,
          )
          .toString(`hex`),
        taken: false,
      });

      return `i/${inviteData.token}`;
    }
    return 'No invites left for you :(';
  }

  async loginUser(data: UserLoginDto): Promise<string | any> {
    let user = await this.userModel.findOne({ username: data.username }).exec();

    if (!user) return 'Invalid credentials';

    var hash = crypto
      .pbkdf2Sync(data.password, user.salt, 1000, 64, `sha512`)
      .toString(`hex`);

    if (user.hash === hash) {
      user.token = uuidv4();
      user.save();
      return user.token;
    } else return false;
  }

  async registerUser(data: UserCreateDto): Promise<string | any> {
    let inviteData = await this.inviteDataModel.findOne({
      token: data.invite_token,
    });

    if (
      (!inviteData || inviteData.taken) &&
      data.invite_token != 'magicInvite_Duoc2023'
    ) {
      return 'Invite Invalid';
    }

    if (inviteData) {
      let user = await this.userModel.findOne({ id: inviteData.parent_user });
      if (user.invites_left <= 0) return 'Invite Invalid';
      user.invites_left = user.invites_left - 1;
      await user.save();
    }

    let salt = crypto.randomBytes(16).toString('hex');
    const createdUser = new this.userModel({
      id: uuidv4().toString(),
      username: data.username,
      mail: data.mail,
      seen: [],
      favs: [],
      hash: crypto
        .pbkdf2Sync(data.password.toString(), salt, 1000, 64, `sha512`)
        .toString(`hex`),
      salt: salt,
      token: '',
      invites_left: 5,
    });

    if (inviteData) {
      inviteData.taken = true;
      inviteData.child_user = createdUser.id;
      await inviteData.save();
    }

    return await createdUser.save();
  }

  async getUserFavs(token: string): Promise<string | any> {
    let user = await this.userModel.findOne({ token: token }).exec();
    return user.favs;
  }

  async pushFavs(token: string, animeId: string): Promise<string | any> {
    let user = await this.userModel.findOne({ token: token }).exec();
    if (user.favs.includes(animeId)) {
      user.favs.splice(user.favs.indexOf(animeId), 1);
    } else {
      user.favs.push(animeId);
    }

    await user.save();
    return user.favs;
  }

  async getUserSeen(token: string): Promise<string | any> {
    let user = await this.userModel.findOne({ token: token }).exec();
    let seenData = await this.seenDataModel.find({ user: user.id }).exec();
    return seenData;
  }

  async getUserSeen_filter(token, animeId): Promise<string | any> {
    let user = await this.userModel.findOne({ token: token }).exec();
    let seenData = await this.seenDataModel
      .find({ user: user.id, anime: animeId })
      .exec();
    return seenData;
  }

  async pushSeen(token: string, data: SeenAnimeEp): Promise<string | any> {
    let user = await this.userModel.findOne({ token: token }).exec();
    let seenData = await this.seenDataModel
      .findOne({ user: user.id, anime: data.anime })
      .exec();

    if (seenData) {
      if (!seenData.episodes.includes(data.episodes)) {
        seenData.episodes.push(data.episodes);
        await seenData.save();
        return seenData;
      }
    }

    let returnable = await this.seenDataModel.create({
      anime: data.anime,
      user: user.id,
      episodes: [data.episodes],
    });

    await returnable.save();
    return returnable;
  }
}
