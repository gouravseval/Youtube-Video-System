import express from 'express'
import {connectDB} from './src/db/index.js' 

const app = express()

connectDB()

app.use(express.json())


