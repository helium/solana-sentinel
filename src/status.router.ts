import express, { Request, Response } from 'express'

export const statusRouter = express.Router()

type MigrationStatus = 'not_started' | 'in_progress' | 'complete'

export type Status = {
  migrationStatus: MigrationStatus
  minimumVersions: Record<string, string>
  finalBlockHeight: number | null
}

statusRouter.get('/', async (_req: Request, res: Response) => {
  const migrationStatus = (process.env.MIGRATION_STATUS ||
    'not_started') as MigrationStatus
  if (!['not_started', 'in_progress', 'completed'].includes(migrationStatus)) {
    throw new Error('Invalid migration status')
  }

  const minimumVersions =
    process.env.MINIMUM_VERSIONS?.split(',')?.reduce((prev, cur) => {
      const [bundle, version] = cur.split('=')
      return { ...prev, [bundle]: version }
    }, {}) || {}

  const finalBlockHeight = process.env.FINAL_BLOCK_HEIGHT
    ? parseInt(process.env.FINAL_BLOCK_HEIGHT)
    : null

  const status: Status = {
    migrationStatus,
    minimumVersions,
    finalBlockHeight,
  }

  res.status(200).send(status)
})
