import express, { Request, Response } from 'express'

export const statusRouter = express.Router()

const MigrationStatusKeys = ['not_started', 'in_progress', 'complete'] as const
export type MigrationStatus = typeof MigrationStatusKeys[number]

export type Status = {
  migrationStatus: MigrationStatus
  minimumVersions: Record<string, string>
  finalBlockHeight: number | null
}

statusRouter.get('/', async (_req: Request, res: Response) => {
  const migrationStatus = (process.env.MIGRATION_STATUS ||
    'not_started') as MigrationStatus
  if (!MigrationStatusKeys.includes(migrationStatus)) {
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

statusRouter.get('/vars', async (_req: Request, res: Response) => {
  const vars = {
    mints: {
      mobile: process.env.MOBILE_MINT,
      iot: process.env.IOT_MINT,
      hnt: process.env.HNT_MINT,
      dc: process.env.DC_MINT,
    },
    metadata_urls: {
      mobile: process.env.MOBILE_METADATA_URL,
      iot: process.env.IOT_METADATA_URL,
      hnt: process.env.HNT_METADATA_URL,
      dc: process.env.DC_METADATA_URL,
    },
  }

  res.status(200).send(vars)
})
