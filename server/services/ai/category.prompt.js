import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const CATEGORIES = ['Kitchen & Dining', 'Personal Care', 'Home & Living',
  'Food & Beverages', 'Fashion & Accessories', 'Office & Stationery',
  'Garden & Outdoors', 'Baby & Kids', 'Health & Wellness'];

const SUSTAINABILITY_FILTERS = [
  'plastic-free', 'compostable', 'vegan', 'recycled',
  'biodegradable', 'organic', 'zero-waste', 'fair-trade',
  'upcycled', 'natural'
];

export async function generateCategoryAI(productName,productDescription) {
    const model = genAI.getGenerativeModel({model: 'gemini-pro'});
    const prompt = `
You are a product categorization AI for a sustainable e-commerce platform.

Product Name: ${productName}
Product Description: ${productDescription}

Available Primary Categories: ${CATEGORIES.join(', ')}
Available Sustainability Filters: ${SUSTAINABILITY_FILTERS.join(', ')}

Analyze this product and return ONLY a valid JSON object.
No explanation, no markdown, no backticks. Just raw JSON.

{
  "primary_category": "one from the categories list above",
  "sub_category": "a specific sub-category",
  "seo_tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "sustainability_filters": ["filter1", "filter2"],
  "confidence_score": 0.95,
  "reasoning": "one line explanation"
}
`
const result = await model.generateContent(prompt);
const text = result.response.text();
const cleaned = text.replace(/```json|```/g,'').trim();
return JSON.parse(cleaned);
}