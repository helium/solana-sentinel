import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { statusRouter } from './status.router'

dotenv.config()

const PORT = parseInt(process.env.PORT || '3000', 10)
const ENV = process.env.NODE_ENV || 'development'

const app = express()

if (ENV === 'production') {
  app.enable('trust proxy')

  // Enforce SSL & HSTS in production
  app.use((req, res, nextPlug) => {
    const proto = req.headers['x-forwarded-proto']
    if (proto === 'https') {
      res.set({
        'Strict-Transport-Security': 'max-age=31557600', // one-year
      })
      return nextPlug()
    }
    res.redirect(`https://${req.headers.host}${req.url}`)
  })
}

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use('/', statusRouter)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
