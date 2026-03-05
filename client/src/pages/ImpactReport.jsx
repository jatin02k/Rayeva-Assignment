import { useState } from 'react'
import axios from 'axios'
import JsonDisplay from '../components/JsonDisplay'

const AVAILABLE_TAGS = ['plastic-free', 'recycled', 'organic', 'biodegradable', 'vegan', 'compostable']

export default function ImpactReport() {
  const [products, setProducts] = useState([{ name: '', is_local: false, tags: [] }])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addProduct = () => {
    setProducts([...products, { name: '', is_local: false, tags: [] }])
  }

  const removeProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index))
  }

  const updateProduct = (index, field, value) => {
    const updated = [...products]
    updated[index][field] = value
    setProducts(updated)
  }

  const toggleTag = (index, tag) => {
    const updated = [...products]
    const tags = updated[index].tags
    updated[index].tags = tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
    setProducts(updated)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await axios.post('http://localhost:5000/api/impact', { products })
      setResult(res.data.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-800 mb-2">AI Impact Report</h1>
      <p className="text-gray-500 mb-6 text-sm">Add your order products and get a sustainability impact analysis.</p>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-sm text-gray-700">Product {index + 1}</span>
              {products.length > 1 && (
                <button onClick={() => removeProduct(index)} className="text-red-500 text-sm hover:text-red-700">Remove</button>
              )}
            </div>

            <input
              className="w-full border border-gray-300 rounded-lg p-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Product name"
              value={product.name}
              onChange={e => updateProduct(index, 'name', e.target.value)}
            />

            <label className="flex items-center gap-2 text-sm text-gray-700 mb-3">
              <input
                type="checkbox"
                checked={product.is_local}
                onChange={e => updateProduct(index, 'is_local', e.target.checked)}
                className="accent-green-600"
              />
              Locally sourced (within 200km)
            </label>

            <div>
              <p className="text-xs text-gray-500 mb-2">Sustainability tags:</p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(index, tag)}
                    className={`px-2 py-1 rounded text-xs border transition ${
                      product.tags.includes(tag)
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addProduct}
          className="w-full border-2 border-dashed border-gray-300 text-gray-500 py-2 rounded-lg text-sm hover:border-green-400 hover:text-green-600 transition"
        >
          + Add Another Product
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-700 text-white py-3 rounded-lg font-medium hover:bg-green-800 disabled:opacity-50 transition"
        >
          {loading ? 'Generating Report...' : 'Generate Impact Report'}
        </button>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <JsonDisplay data={result} type="impact" />
    </div>
  )
}