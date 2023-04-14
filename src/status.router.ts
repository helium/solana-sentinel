import express, { Request, Response } from 'express'
import { HNT_MINT, IOT_MINT, MOBILE_MINT, DC_MINT } from '@helium/spl-utils'
export const statusRouter = express.Router()

const MigrationStatusKeys = ['not_started', 'in_progress', 'complete'] as const
export type MigrationStatus = typeof MigrationStatusKeys[number]

const ClusterKeys = ['devnet', 'testnet', 'mainnet-beta'] as const
export type Cluster = typeof ClusterKeys[number]

export type Status = {
  migrationStatus: MigrationStatus
  minimumVersions: Record<string, string>
  finalBlockHeight: number | null
  treasuryWarning: boolean
}

statusRouter.get('/', async (_req: Request, res: Response) => {
  const migrationStatus = (process.env.MIGRATION_STATUS ||
    'not_started') as MigrationStatus
  if (!MigrationStatusKeys.includes(migrationStatus)) {
    return res.status(400).send({ message: 'Invalid migration status' })
  }

  const minimumVersions =
    process.env.MINIMUM_VERSIONS?.split(',')?.reduce((prev, cur) => {
      const [bundle, version] = cur.split('=')
      return { ...prev, [bundle]: version }
    }, {}) || {}

  const finalBlockHeight = process.env.FINAL_BLOCK_HEIGHT
    ? parseInt(process.env.FINAL_BLOCK_HEIGHT)
    : null

  const treasuryWarning = process.env.TREASURY_WARNING
    ? process.env.TREASURY_WARNING === 'true'
    : true

  const status: Status = {
    treasuryWarning,
    migrationStatus,
    minimumVersions,
    finalBlockHeight,
  }

  res.status(200).send(status)
})

statusRouter.get('/vars', async (req: Request, res: Response) => {
  let cluster = req.query['cluster'] as Cluster
  if (!cluster) {
    cluster = 'mainnet-beta'
  }

  if (!ClusterKeys.includes(cluster)) {
    return res.status(400).send({ message: 'Unknown cluster' })
  }

  const vars = {
    mobile: MOBILE_MINT.toBase58(),
    iot: IOT_MINT.toBase58(),
    hnt: HNT_MINT.toBase58(),
    dc: DC_MINT.toBase58(),
  }

  res.status(200).send(vars)
})
