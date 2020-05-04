import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import faker from 'faker';
import { Repository } from 'typeorm';

import { Playlist, PlaylistRepositoryFake } from './playlist.entity';
import {
  CreatePlaylistData,
  PlaylistService,
  RemovePlaylistData,
  UpdatePlaylistData,
} from './playlist.service';

describe('PlaylistService', () => {
  let playlistService: PlaylistService;
  let playlistRepository: Repository<Playlist>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaylistService,
        {
          provide: getRepositoryToken(Playlist),
          useClass: PlaylistRepositoryFake,
        },
      ],
    }).compile();

    playlistService = module.get(PlaylistService);
    playlistRepository = module.get(getRepositoryToken(Playlist));
  });

  describe('updating a playlist', () => {
    it('calls the repository with correct paramaters', async () => {
      const playlistId = faker.random.uuid();
      const title = faker.lorem.sentence();

      const updatePlaylistData: UpdatePlaylistData = {
        id: playlistId,
        title,
      };

      const existingPlaylist = Playlist.of({
        id: playlistId,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: faker.lorem.word(),
      });

      const newPlaylistData = Playlist.of({
        ...existingPlaylist,
        title,
      });

      const savedPlaylist = Playlist.of({
        ...newPlaylistData,
      });

      const playlistServiceFindOneByIdOrThrowSpy = jest
        .spyOn(playlistService, 'findOneByIdOrThrow')
        .mockResolvedValue(existingPlaylist);

      const playlistRepositoryCreateSpy = jest
        .spyOn(playlistRepository, 'create')
        .mockReturnValue(newPlaylistData);

      const playlistRepositorySaveSpy = jest
        .spyOn(playlistRepository, 'save')
        .mockResolvedValue(savedPlaylist);

      const result = await playlistService.updateOne(updatePlaylistData);

      expect(playlistServiceFindOneByIdOrThrowSpy).toHaveBeenCalledWith(
        updatePlaylistData.id,
      );

      expect(playlistRepositoryCreateSpy).toHaveBeenCalledWith({
        ...existingPlaylist,
        title,
      });

      expect(playlistRepositorySaveSpy).toHaveBeenCalledWith(newPlaylistData);
      expect(result).toEqual(savedPlaylist);
    });
  });

  describe('removing a playlist', () => {
    it('calls the repository with correct paramaters', async () => {
      const playlistId = faker.random.uuid();

      const removePlaylistData: RemovePlaylistData = {
        id: playlistId,
      };

      const existingPlaylist = Playlist.of({
        id: playlistId,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: faker.lorem.sentence(),
      });

      const playlistServiceFindOneByIdOrThrowSpy = jest
        .spyOn(playlistService, 'findOneByIdOrThrow')
        .mockResolvedValue(existingPlaylist);

      const playlistRepositoryRemoveSpy = jest
        .spyOn(playlistRepository, 'remove')
        .mockResolvedValue(null);

      const result = await playlistService.removeOne(removePlaylistData);

      expect(playlistServiceFindOneByIdOrThrowSpy).toHaveBeenCalledWith(
        removePlaylistData.id,
      );

      expect(playlistRepositoryRemoveSpy).toHaveBeenCalledWith([
        existingPlaylist,
      ]);

      expect(result).toBe(null);
    });
  });

  describe('creating a playlist', () => {
    it('throws an error when no title is provided', async () => {
      const title = '';

      expect.assertions(2);

      try {
        await playlistService.createOne({ title });
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Title is required.');
      }
    });

    it('calls the repository with correct paramaters', async () => {
      const title = faker.lorem.sentence();

      const createPlaylistData: CreatePlaylistData = {
        title,
      };

      const createdPlaylistEntity = Playlist.of(createPlaylistData);

      const savedPlaylist = Playlist.of({
        id: faker.random.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        title,
      });

      const playlistRepositorySaveSpy = jest
        .spyOn(playlistRepository, 'save')
        .mockResolvedValue(savedPlaylist);

      const playlistRepositoryCreateSpy = jest
        .spyOn(playlistRepository, 'create')
        .mockReturnValue(createdPlaylistEntity);

      const result = await playlistService.createOne(createPlaylistData);

      expect(playlistRepositoryCreateSpy).toBeCalledWith(createPlaylistData);
      expect(playlistRepositorySaveSpy).toBeCalledWith(createdPlaylistEntity);
      expect(result).toEqual(savedPlaylist);
    });
  });

  describe('finding a playlist', () => {
    it('throws an error when a playlist doesnt exist', async () => {
      const playlistId = faker.random.uuid();

      const playlistRepositoryFindOneSpy = jest
        .spyOn(playlistRepository, 'findOne')
        .mockResolvedValue(null);

      expect.assertions(3);

      try {
        await playlistService.findOneByIdOrThrow(playlistId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('No playlist found.');
      }

      expect(playlistRepositoryFindOneSpy).toHaveBeenCalledWith({
        id: playlistId,
      });
    });

    it('returns the found playlist', async () => {
      const playlistId = faker.random.uuid();

      const existingPlaylist = Playlist.of({
        id: playlistId,
        createdAt: new Date(),
        updatedAt: new Date(),
        title: faker.lorem.sentence(),
      });

      const playlistRepositoryFindOneSpy = jest
        .spyOn(playlistRepository, 'findOne')
        .mockResolvedValue(existingPlaylist);

      const result = await playlistService.findOneByIdOrThrow(playlistId);

      expect(result).toBe(existingPlaylist);
      expect(playlistRepositoryFindOneSpy).toHaveBeenCalledWith({
        id: playlistId,
      });
    });
  });
});
