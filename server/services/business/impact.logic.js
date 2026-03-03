export function validateOrderInput(products) {
  if (!products || !Array.isArray(products))
    throw new Error('products must be an array')
  if (products.length === 0)
    throw new Error('Order must have at least one product')
  products.forEach((p, i) => {
    if (!p.name) throw new Error(`Product at index ${i} missing name`)
  })
}

export function roundImpactNumbers(aiResult) {
  return {
    ...aiResult,
    plastic_saved_grams: Math.round(aiResult.plastic_saved_grams),
    carbon_avoided_kg: parseFloat(aiResult.carbon_avoided_kg?.toFixed(2)),
    local_sourcing_percentage: Math.round(aiResult.local_sourcing_percentage)
  }
};