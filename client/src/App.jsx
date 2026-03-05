import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CategoryTagger from './pages/CategoryTagger'
import ImpactReport from './pages/ImpactReport'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<CategoryTagger />} />
          <Route path="/impact" element={<ImpactReport />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App