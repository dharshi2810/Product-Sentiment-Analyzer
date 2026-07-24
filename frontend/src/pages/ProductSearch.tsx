import { useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import { Search, Loader2, Star, Sparkles, MessageCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function ProductSearch() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [error, setError] = useState('')
  
  const navigate = useNavigate()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query) return
    
    setIsSearching(true)
    setError('')
    setResult(null)
    setReviews([])
    
    const token = localStorage.getItem('token')
    if (!token) {
      setError('You must be logged in to use the analyzer.')
      setIsSearching(false)
      setTimeout(() => navigate('/auth'), 2000)
      return
    }

    // Hardcoding the live Render URL to guarantee connection
    const apiUrl = 'https://sentiment-backend-v2.onrender.com/api'

    try {
      // 1. Start Scraping
      const searchRes = await axios.post(`${apiUrl}/search`, 
        { product_name: query },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      const productId = searchRes.data.product_id

      // 2. Fetch Summary & Metrics
      const summaryRes = await axios.get(`${apiUrl}/summary/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // 3. Fetch all reviews (up to 30)
      const reviewsRes = await axios.get(`${apiUrl}/reviews/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const metrics = summaryRes.data.metrics
      
      setResult({
        product: query,
        reviewsCount: searchRes.data.count,
        positive: metrics.positive_percentage.toFixed(0),
        negative: metrics.negative_percentage.toFixed(0),
        neutral: metrics.neutral_percentage.toFixed(0),
        summary: summaryRes.data.summary
      })
      
      setReviews(reviewsRes.data)

    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || err.message || 'An error occurred while scraping.')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto pb-20">
        <div className="text-center mb-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Neural Analysis Core</span>
          </motion.div>
          <h2 className="text-4xl font-black text-white text-glow mb-4 tracking-tight">Extract Sentiments</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Deploy the scraper to Flipkart. We will extract up to 30 recent verified reviews and run them through our NLP engine.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative z-10 max-w-3xl mx-auto mb-16">
          <div className="relative flex items-center glass-card rounded-full overflow-hidden p-1">
            <div className="pl-6 text-primary">
              <Search className="w-6 h-6" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter product name (e.g. Sony WH-1000XM5)..."
              className="flex-1 px-4 py-5 bg-transparent border-none focus:outline-none text-white text-lg placeholder:text-slate-600"
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="bg-primary hover:bg-primary/80 disabled:bg-slate-800 disabled:text-slate-500 text-white px-8 py-4 m-1 rounded-full font-bold transition-all h-full flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Extracting...
                </>
              ) : 'Analyze Data'}
            </button>
          </div>
          
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </motion.div>
          )}
        </form>

        <AnimatePresence>
          {isSearching && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-primary"
            >
              <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin shadow-[0_0_30px_rgba(168,85,247,0.5)]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white text-glow">Deploying Scraper</h3>
              <p className="text-slate-400 text-center max-w-md">Bypassing captchas and extracting data from product pages. This neural cycle requires 10-20 seconds.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {result && !isSearching && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Dashboard Hero */}
            <div className="glass-panel rounded-3xl p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
              
              <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative z-10">
                <div>
                  <h3 className="text-3xl font-black text-white mb-2">{result.product}</h3>
                  <p className="text-slate-400 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Analyzed {result.reviewsCount} recent verified reviews
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <div className="px-6 py-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex flex-col items-center">
                    <span className="text-3xl font-black text-green-400">{result.positive}%</span>
                    <span className="text-xs text-green-500/70 uppercase tracking-wider font-bold">Positive</span>
                  </div>
                  <div className="px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col items-center">
                    <span className="text-3xl font-black text-red-400">{result.negative}%</span>
                    <span className="text-xs text-red-500/70 uppercase tracking-wider font-bold">Negative</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 glass-card rounded-2xl border-l-4 border-l-primary">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Synthesis
                </h4>
                <p className="text-slate-300 leading-relaxed text-lg">
                  "{result.summary}"
                </p>
              </div>
            </div>

            {/* Reviews Grid */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 pl-2">Raw Data Feed ({reviews.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((rev, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={idx} 
                    className="glass-card p-6 rounded-2xl flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'}`} />
                        ))}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        rev.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' : 
                        rev.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {rev.sentiment.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-300 mb-6 flex-1 text-sm leading-relaxed">
                      "{rev.review}"
                    </p>
                    <div className="flex justify-between items-center text-xs text-slate-500 pt-4 border-t border-slate-800">
                      <span className="font-medium text-slate-400">{rev.reviewer}</span>
                      <span>{rev.date}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
          </motion.div>
        )}

      </div>
    </DashboardLayout>
  )
}
