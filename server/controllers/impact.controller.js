import { validateOrderInput, roundImpactNumbers } from '../services/business/impact.logic.js'
import { generateImpactAI } from '../services/ai/impact.prompt.js'
import ImpactReport from '../db/models/ImpactReport.js'
import PromptLog from '../db/models/PromptLog.js'

export async function generateImpactReport(req, res, next) {
  try {
    const { products } = req.body
    validateOrderInput(products)
    const aiResult = await generateImpactAI(products)
    const finalResult = roundImpactNumbers(aiResult)
    await ImpactReport.create({ order_data: { products }, ai_output: finalResult, impact_statement: finalResult.impact_statement })
    await PromptLog.create({ module: 'impact', prompt: JSON.stringify(products), response: JSON.stringify(aiResult) })
    res.json({ success: true, data: finalResult })
  } catch (err) {
    next(err)
  }
}