import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { SeenAnimeEp } from '../dto/UserData.dto';
import { UserLoginDto } from '../dto/UserLogin.dto';
import { UserCreateDto } from '../dto/UserCreate.dto';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { SeenData } from 'src/seenData/seenData.schema';
import { InviteData } from 'src/inviteData/inviteData.schema';
import { ReturnUserDataDto } from 'src/dto/ReturnUserData.dto';
import { ReturnErrorDto } from 'src/dto/ReturnError.dto';
import { ReturnInviteTokenDto } from 'src/dto/ReturnInviteToken.dto';
import { ReturnAuthTokenDto } from 'src/dto/ReturnAuthToken.dto';
import { ReturnUserCreatedDto } from 'src/dto/ReturnUserCreated.dto';
import { ReturnUserFavsDto } from 'src/dto/ReturnUserFavs.dto';
import { ReturnUserSeenDto } from 'src/dto/ReturnUserSeen.dto';
import { UserRoles } from 'src/enum/userRoles.enum';
import { RenewToken } from 'src/renewToken/renewToken.schema';
import { RenewUserTokenDto } from 'src/dto/RenewUserToken.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(SeenData.name) private readonly seenDataModel: Model<SeenData>,
    @InjectModel(InviteData.name)
    private readonly inviteDataModel: Model<InviteData>,
    @InjectModel(RenewToken.name)
    private readonly renewTokenModel: Model<RenewToken>,
  ) {}

  async checkRole(token: string, role: UserRoles): Promise<boolean> {
    let user = await this.userModel.findOne({ token: token }).exec();

    if (!user) return false;

    return user.role == role;
  }

  async checkToken(token: string): Promise<boolean> {
    let user = await this.userModel.findOne({ token: token }).exec();

    if (!user) return false;
    else return true;
  }

  async getUserData(
    token: string,
  ): Promise<ReturnUserDataDto | ReturnErrorDto> {
    let user = await this.userModel.findOne({ token: token }).exec();
    if (!user)
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

    let seenData = await this.seenDataModel
      .find({ user: user.id })
      .sort([
        ['anime', 1],
        ['__v', -1],
      ])
      .exec();
    user.seen = seenData;

    user.salt = '';
    user.hash = '';
    user.token = '';

    return user as ReturnUserDataDto;
  }

  async getInviteToken(
    token: string,
  ): Promise<ReturnInviteTokenDto | ReturnErrorDto> {
    let user = await this.userModel.findOne({ token: token }).exec();

    if (!user)
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

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

      return { invite_token: inviteData.token };
    }
    return {
      status: 405,
      error_code: 'NO_INVITES',
      message: "You can't invite anymore",
    };
  }

  async loginUser(
    data: UserLoginDto,
    ip: string,
  ): Promise<ReturnAuthTokenDto | ReturnErrorDto> {
    let user = await this.userModel.findOne({ username: data.username }).exec();

    if (!user)
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

    const hash = crypto
      .pbkdf2Sync(data.password, user.salt, 1000, 64, `sha512`)
      .toString(`hex`);

    if (user.hash === hash) {
      user.token = uuidv4();
      let renew = await this.renewTokenModel.create({
        user: user.id,
        ip: ip,
        token: uuidv4(),
      });
      await renew.save();
      user.save();
      return { token: user.token, renew: renew.token };
    } else
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };
  }

  async renewUserToken(
    data: RenewUserTokenDto,
    ip: string,
  ): Promise<ReturnAuthTokenDto | ReturnErrorDto> {
    let renewer = await this.renewTokenModel
      .findOne({ token: data.token, ip: ip })
      .exec();

    if (!renewer)
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

    let user = await this.userModel.findOne({ id: renewer.user }).exec();

    if (!user)
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

    user.token = uuidv4();
    renewer.token = uuidv4();

    renewer.save();
    user.save();
    return { token: user.token, renew: renewer.token };
  }

  async registerUser(
    data: UserCreateDto,
  ): Promise<ReturnUserCreatedDto | ReturnErrorDto> {
    //let inviteData = await this.inviteDataModel
    //  .findOne({
    //    token: data.invite_token,
    //  })
    //  .exec();

    //if ((!inviteData || inviteData.taken) && data.invite_token != '') {
    //  return {
    //    status: 403,
    //    error_code: 'UNINVITED',
    //    message: 'You must have a valid invite code to register',
    //  };
    //}

    console.log(await this.userModel.find({ username: data.username }).exec());
    console.log(await this.userModel.find({ mail: data.mail }).exec());

    if (
      (await this.userModel.findOne({ username: data.username }).exec()) ||
      (await this.userModel.findOne({ mail: data.mail }).exec())
    )
      return {
        status: 405,
        error_code: 'Username or Mail taken',
        message: 'There is already an account with this username or mail',
      };

    //if (inviteData) {
    //  let user = await this.userModel
    //    .findOne({ id: inviteData.parent_user })
    //    .exec();
    //  if (user.invites_left <= 0)
    //    return {
    //      status: 403,
    //      error_code: 'UNINVITED',
    //      message: 'You must have a valid invite code to register',
    //    };
    //  user.invites_left = user.invites_left - 1;
    //  await user.save();
    //}

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

    //if (inviteData) {
    //  inviteData.taken = true;
    //  inviteData.child_user = createdUser.id;
    //  await inviteData.save();
    //}

    return (await createdUser.save()) as ReturnUserCreatedDto;
  }

  async getUserFavs(
    token: string,
  ): Promise<ReturnUserFavsDto | ReturnErrorDto> {
    let user = await this.userModel.findOne({ token: token }).exec();
    if (!user)
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

    return { favs: user.favs };
  }

  async pushFavs(
    token: string,
    animeId: string,
  ): Promise<ReturnUserFavsDto | ReturnErrorDto> {
    let user = await this.userModel.findOne({ token: token }).exec();
    if (!user)
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

    if (user.favs.includes(animeId)) {
      user.favs.splice(user.favs.indexOf(animeId), 1);
    } else {
      user.favs.push(animeId);
    }

    await user.save();
    return { favs: user.favs };
  }

  async getUserSeen(
    token: string,
  ): Promise<ReturnUserSeenDto | ReturnErrorDto> {
    let user = await this.userModel.findOne({ token: token }).exec();

    if (!user)
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

    let seenData = await this.seenDataModel.find({ user: user.id }).exec();
    return { seen: seenData };
  }

  async getUserSeen_filter(
    token: string,
    animeId: string,
  ): Promise<ReturnUserSeenDto | ReturnErrorDto> {
    let user = await this.userModel.findOne({ token: token }).exec();
    if (!user)
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

    let seenData = await this.seenDataModel
      .findOne({ user: user.id, anime: animeId })
      .exec();

    return { seen: [seenData] };
  }

  async pushSeen(
    token: string,
    data: SeenAnimeEp,
  ): Promise<ReturnUserSeenDto | ReturnErrorDto> {
    let user = await this.userModel.findOne({ token: token }).exec();
    if (!user)
      return {
        status: 403,
        error_code: 'INVALID_TOKEN',
        message: 'Invalid authentication token',
      };

    let seenData = await this.seenDataModel
      .findOne({ user: user.id, anime: data.anime })
      .exec();

    if (seenData) {
      if (!seenData.episodes.includes(data.episodes)) {
        seenData.episodes.push(data.episodes);
        seenData = await seenData.save();
      }

      return {
        seen: [
          {
            anime: seenData.anime,
            episodes: seenData.episodes,
          },
        ],
      };
    } else {
      let returnable = await this.seenDataModel.create({
        anime: data.anime,
        user: user.id,
        episodes: [data.episodes],
      });
      await returnable.save();
      return {
        seen: await this.seenDataModel
          .find({ user: user.id, anime: data.anime })
          .exec(),
      };
    }
  }

  async deleteUser(token: string): Promise<any> {
    let user = await this.userModel.findOne({ token: token }).exec();

    if (!user)
      return {
        status: 403,
        error_code: 'INVALID',
      };

    await this.userModel.deleteOne({ id: user.id }).exec();

    return {
      status: 204,
      message: 'User deleted',
    };
  }
}
