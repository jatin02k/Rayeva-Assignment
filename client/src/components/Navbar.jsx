import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-green-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Rayeva AI</h1>
      <div className="flex gap-6">
        <Link to="/" className="hover:text-green-300">Category Tagger</Link>
        <Link to="/impact" className="hover:text-green-300">Impact Report</Link>
      </div>
    </nav>
  )
}