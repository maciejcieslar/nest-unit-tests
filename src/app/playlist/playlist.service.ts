import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Playlist } from './playlist.entity';

export interface CreatePlaylistData {
  readonly title: string;
}

export interface RemovePlaylistData {
  readonly id: string;
}

export interface UpdatePlaylistData {
  readonly id: string;
  readonly title?: string;
}

@Injectable()
export class PlaylistService {
  public constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
  ) {}

  public async findOneByIdOrThrow(id: string): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      id,
    });

    if (!playlist) {
      throw new NotFoundException('No playlist found.');
    }

    return playlist;
  }

  public async createOne(
    createPlaylistData: CreatePlaylistData,
  ): Promise<Playlist> {
    const { title } = createPlaylistData;

    if (!title) {
      throw new BadRequestException('Title is required.');
    }

    const playlist = this.playlistRepository.create({
      title,
    });

    const createdPlaylist = await this.playlistRepository.save(playlist);

    return createdPlaylist;
  }

  public async removeOne(
    removePlaylistData: RemovePlaylistData,
  ): Promise<void> {
    const { id } = removePlaylistData;

    const playlist = await this.findOneByIdOrThrow(id);

    await this.playlistRepository.remove([playlist]);

    return null;
  }

  public async updateOne(
    updatePlaylistData: UpdatePlaylistData,
  ): Promise<Playlist> {
    const { id, ...updateData } = updatePlaylistData;

    const existingPlaylist = await this.findOneByIdOrThrow(id);

    const playlist = this.playlistRepository.create({
      ...existingPlaylist,
      ...updateData,
    });

    const updatedPlaylist = await this.playlistRepository.save(playlist);

    return updatedPlaylist;
  }
}
