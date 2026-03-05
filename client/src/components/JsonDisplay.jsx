export default function JsonDisplay({ data, type }) {
  if (!data) return null

  if (type === 'category') {
    return (
      <div className="mt-6 bg-gray-50 rounded-lg p-5 border border-gray-200">
        <h2 className="font-bold text-green-700 text-lg mb-4">AI Output</h2>

        <div className="mb-3 flex items-center gap-2">
          <span className="font-medium">Category:</span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">{data.primary_category}</span>
          <span>→</span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{data.sub_category}</span>
        </div>

        <div className="mb-3">
          <span className="font-medium">SEO Tags:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.seo_tags?.map(tag => (
              <span key={tag} className="bg-gray-200 px-2 py-1 rounded text-sm">{tag}</span>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <span className="font-medium">Sustainability:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.sustainability_filters?.map(f => (
              <span key={f} className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm">♻ {f}</span>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <span className="font-medium">Confidence:</span>
          <span className="ml-2 text-green-700 font-bold">{(data.confidence_score * 100).toFixed(0)}%</span>
        </div>

        <div className="mb-4">
          <span className="font-medium">Reasoning:</span>
          <p className="text-gray-600 mt-1 text-sm">{data.reasoning}</p>
        </div>

        <details>
          <summary className="cursor-pointer text-gray-400 text-sm">View raw JSON</summary>
          <pre className="text-xs mt-2 bg-gray-100 p-3 rounded overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </details>
      </div>
    )
  }

  if (type === 'impact') {
    return (
      <div className="mt-6 bg-gray-50 rounded-lg p-5 border border-gray-200">
        <h2 className="font-bold text-green-700 text-lg mb-4">Impact Report</h2>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg p-3 text-center border">
            <div className="text-2xl font-bold text-green-700">{data.plastic_saved_grams}g</div>
            <div className="text-xs text-gray-500 mt-1">Plastic Saved</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border">
            <div className="text-2xl font-bold text-blue-700">{data.carbon_avoided_kg}kg</div>
            <div className="text-xs text-gray-500 mt-1">Carbon Avoided</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border">
            <div className="text-2xl font-bold text-emerald-700">{data.local_sourcing_percentage}%</div>
            <div className="text-xs text-gray-500 mt-1">Local Sourcing</div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 font-medium">{data.impact_statement}</p>
        </div>

        <div className="mb-3">
          <span className="font-medium">Local Sourcing:</span>
          <p className="text-gray-600 text-sm mt-1">{data.local_sourcing_summary}</p>
        </div>

        {data.breakdown?.per_product?.length > 0 && (
          <div>
            <span className="font-medium">Per Product Breakdown:</span>
            <div className="mt-2 space-y-2">
              {data.breakdown.per_product.map((p, i) => (
                <div key={i} className="bg-white border rounded p-3 text-sm flex justify-between">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-gray-500">🧴 {p.plastic_saved_grams}g plastic · 🌿 {p.carbon_avoided_kg}kg CO2</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <details className="mt-4">
          <summary className="cursor-pointer text-gray-400 text-sm">View raw JSON</summary>
          <pre className="text-xs mt-2 bg-gray-100 p-3 rounded overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </details>
      </div>
    )
  }
}