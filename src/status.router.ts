import express, { Request, Response } from 'express'

export const statusRouter = express.Router()

const MigrationStatusKeys = ['not_started', 'in_progress', 'complete'] as const
export type MigrationStatus = typeof MigrationStatusKeys[number]

const ClusterKeys = ['devnet', 'testnet', 'mainnet-beta'] as const
export type Cluster = typeof ClusterKeys[number]

export type Status = {
  migrationStatus: MigrationStatus
  minimumVersions: Record<string, string>
  finalBlockHeight: number | null
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

  const status: Status = {
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

  const getEnvVars = (varName: 'IOT' | 'MOBILE' | 'HNT' | 'DC') => {
    const postfix = cluster !== 'mainnet-beta' ? cluster.toUpperCase() : ''
    const metadata_url = process.env[`${varName}_METADATA_URL_${postfix}`]
    const mint = process.env[`${varName}_MINT_${postfix}`]
    return { metadata_url, mint }
  }

  const vars = {
    mobile: getEnvVars('MOBILE'),
    iot: getEnvVars('IOT'),
    hnt: getEnvVars('HNT'),
    dc: getEnvVars('DC'),
  }

  res.status(200).send(vars)
})
