import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'] ?? '',
    // directUrl is used by Prisma Migrate to bypass pgbouncer for DDL
    // Set DIRECT_URL to the non-pooled Supabase connection string
  },
})
