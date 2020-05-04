import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { entities } from './database.entities';

export const DatabaseModule = TypeOrmModule.forRootAsync({
  useFactory: () => {
    return {
      entities,
      url: process.env.DATABASE_URL,
      type: 'postgres',
      namingStrategy: new SnakeNamingStrategy(),
    };
  },
});
