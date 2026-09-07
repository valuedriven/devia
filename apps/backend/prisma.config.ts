import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../.env') });
import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'src/database/prisma/schema.prisma',
  migrations: {
    // Prisma 7 reads the seed command from this file (package.json#prisma.seed is
    // no longer supported). It runs automatically after `migrate reset` / `migrate dev`.
    seed: 'npx ts-node src/database/prisma/seed.ts',
  },
  datasource: {
    // env() throws if DATABASE_URL is absent (breaks Docker build stage).
    // Use process.env with fallback — the real URL is injected at runtime via docker-compose.
    url: process.env.DATABASE_URL ?? 'postgresql://dummy:dummy@localhost:5432/dummy',
  },
});
