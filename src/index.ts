import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { statusRouter } from './status.router'

dotenv.config()

const PORT = parseInt(process.env.PORT || '3000', 10)

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use('/', statusRouter)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
