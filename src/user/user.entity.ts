import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Anime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  mail: string;

  @Column()
  salt: string;

  @Column()
  hash: string;

  @Column()
  epSeen: string[];

  @Column()
  favorites: string[];
}
