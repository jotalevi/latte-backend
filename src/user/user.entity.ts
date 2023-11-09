import { NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { SeenAnimeEp } from './dto/UserData.dto';

const CyclicDb = require('@cyclic.sh/dynamodb');
const db = CyclicDb('sore-tan-narwhal-bootCyclicDB');

const users = db.collection('users');

class User {
  private id: string;
  private username: string;
  private mail: string;

  private seen: SeenAnimeEp[];
  private favs: string[];

  private hash: string;
  private salt: string;
  private token: string;

  setUsername = (username: string) => {
    this.username = username;
  };

  setMail = (mail: string) => {
    this.mail = mail;
  };

  setSeen = (seen: SeenAnimeEp[]) => {
    this.seen = seen;
  };

  setFavs = (favs: string[]) => {
    this.favs = favs;
  };

  getId = (): string => {
    return this.id;
  };

  getUsername = (): string => {
    return this.username;
  };

  getMail = (): string => {
    return this.mail;
  };

  getSeen = (): SeenAnimeEp[] => {
    return this.seen;
  };

  getFavs = (): string[] => {
    return this.favs;
  };

  addFavs = (newFavs: string) => {
    this.favs.push(newFavs);
  };

  delFavs = (delFavs: string) => {
    this.favs.indexOf(delFavs);
  };

  addSeen = (newSeen: SeenAnimeEp) => {
    this.seen.push(newSeen);
  };

  setPassword = (password: string) => {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto
      .pbkdf2Sync(password.toString(), this.salt, 1000, 64, `sha512`)
      .toString(`hex`);
  };

  proofPass = (password: string): string | boolean => {
    var hash = crypto
      .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
      .toString(`hex`);

    if (this.hash === hash) this.token = uuidv4();
    else return false;
  };

  save = async () => {
    console.log(this);
    console.log(JSON.parse(JSON.stringify(this)));
    await users.set(this.id);
  };

  static fromDb = (data): User => {
    let user = new User();
    try {
      user.id = data.id;
      user.username = data.username;
      user.mail = data.mail;

      user.seen = data.seen;
      user.favs = data.favs;

      user.hash = data.hash;
      user.salt = data.pass;
    } catch {
      throw new NotFoundException('No user found');
    }
    return user;
  };

  static findByUsername = async (username: string): Promise<User> => {
    return User.fromDb(await users.findBy({ username: username }));
  };

  static findBytoken = async (token: string): Promise<User> => {
    return User.fromDb(await users.findBy({ token: token }));
  };

  static findById = async (id: string): Promise<User> => {
    return User.fromDb(await users.get(id));
  };

  static create = () => {
    let user = new User();
    user.id = uuidv4();
    return user;
  };

  static delete = () => {};
}

export { User, users };
