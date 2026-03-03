import express from 'express'
import { generateImpactReport } from '../controllers/impact.controller.js'

const router = express.Router()
router.post('/', generateImpactReport)
export default router