import { GoogleGenerativeAI } from '@google/generative-ai'

export async function generateImpactAI(products) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prompt = `
You are a sustainability impact analyst for an eco-commerce platform.

Order contains these products:
${JSON.stringify(products, null, 2)}

Use these estimation rules:
- Each plastic-free product saves 50-200g of plastic depending on size
- Each local product (is_local: true) avoids 0.2kg of carbon
- Each organic/recycled product avoids 0.3kg of carbon
- Calculate local_sourcing_percentage based on how many products have is_local: true

Return ONLY a valid JSON object. No explanation, no markdown, no backticks.

{
  "plastic_saved_grams": 150,
  "carbon_avoided_kg": 0.8,
  "local_sourcing_percentage": 75,
  "local_sourcing_summary": "X of Y products sourced locally",
  "impact_statement": "Your order saved Xg of plastic and avoided Xkg of CO2 — equivalent to driving X km less.",
  "breakdown": {
    "per_product": [
      { "name": "product name", "plastic_saved_grams": 50, "carbon_avoided_kg": 0.2 }
    ]
  }
}
`

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  const cleaned = text.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}