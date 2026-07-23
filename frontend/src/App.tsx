import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import ProductSearch from './pages/ProductSearch'
import Analytics from './pages/Analytics'
import AuthPage from './pages/AuthPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        {/* We would normally wrap these in a ProtectedRoute and DashboardLayout */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<ProductSearch />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
