import { useState } from 'react'
import axios from 'axios'
import JsonDisplay from '../components/JsonDisplay'

export default function CategoryTagger() {
  const [form, setForm] = useState({ product_name: '', product_description: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await axios.post('http://localhost:5000/api/category', form)
      setResult(res.data.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-800 mb-2">AI Product Categorizer</h1>
      <p className="text-gray-500 mb-6 text-sm">Enter a product and let AI assign categories, SEO tags and sustainability filters.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g. Bamboo Toothbrush"
            value={form.product_name}
            onChange={e => setForm({ ...form, product_name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Describe the product in detail..."
            rows={4}
            value={form.product_description}
            onChange={e => setForm({ ...form, product_description: e.target.value })}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-700 text-white py-3 rounded-lg font-medium hover:bg-green-800 disabled:opacity-50 transition"
        >
          {loading ? 'Analyzing...' : 'Generate Tags'}
        </button>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <JsonDisplay data={result} type="category" />
    </div>
  )
}