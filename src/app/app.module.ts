import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [DatabaseModule, PlaylistModule],
  exports: [DatabaseModule, PlaylistModule],
})
export class AppModule {}
