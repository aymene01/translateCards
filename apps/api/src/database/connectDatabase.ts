import { PrismaClient } from '@prisma/client'
import { DatabaseOption } from './types'

declare const global: typeof globalThis & { prisma: PrismaClient }

export function connectDatabase(opts: DatabaseOption) {
  const url = new URL(opts.databaseUrl)

  url.searchParams.append('connection_limit', `${opts.connectionPoolSize}`)
  url.searchParams.append('pool_timeout', `${opts.queryTimeout}`)

  const prisma =
    global.prisma ||
    new PrismaClient({
      datasources: {
        db: {
          url: url.href,
        },
      },
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'info', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
    })

  return {
    prisma,
    start: async () => {
      await prisma.$connect()
      opts.logger.info('🔌 Succesfully connected to the database')
    },
    stop: async () => {
      await prisma.$disconnect()
    },
  }
}

export type Database = Awaited<ReturnType<typeof connectDatabase>>
