import { validateCategoryInput, enrichCategoryResult } from '../services/business/category.logic.js'
import { generateCategoryAI } from '../services/ai/category.prompt.js'
import CategoryResult from '../db/models/CategoryResult.js'
import PromptLog from '../db/models/PromptLog.js'

export async function categorizeProduct(req, res, next) {
  try {
    const { product_name, product_description } = req.body
    validateCategoryInput(product_name, product_description)
    const aiResult = await generateCategoryAI(product_name, product_description)
    const finalResult = enrichCategoryResult(aiResult, product_name)
    await CategoryResult.create({ product_name, product_description, ai_output: finalResult })
    await PromptLog.create({ module: 'category', prompt: `${product_name}: ${product_description}`, response: JSON.stringify(aiResult) })
    res.json({ success: true, data: finalResult })
  } catch (err) {
    next(err)
  }
}