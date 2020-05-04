import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Playlist } from './playlist.entity';
import { PlaylistService } from './playlist.service';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist])],
  providers: [PlaylistService],
  exports: [TypeOrmModule, PlaylistService],
})
export class PlaylistModule {}
