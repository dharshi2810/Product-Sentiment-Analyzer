import { useState } from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import { Search, Loader2 } from 'lucide-react'

export default function ProductSearch() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query) return
    
    setIsSearching(true)
    
    // Mock API Call
    setTimeout(() => {
      setIsSearching(false)
      setResult({
        product: query,
        reviewsCount: 150,
        positive: 80,
        negative: 15,
        neutral: 5,
        summary: `This product has overwhelmingly positive reviews. Users appreciate battery life, display and performance while some mention heating issues.`
      })
    }, 4000)
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold dark:text-white mb-2">Analyze Any Product</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Enter a product name from Flipkart or Amazon, and our AI will scrape and analyze reviews instantly.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative flex items-center shadow-sm rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden mb-12">
          <div className="pl-6 text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Samsung Galaxy S25, iPhone 17..."
            className="flex-1 px-4 py-5 bg-transparent border-none focus:outline-none dark:text-white text-lg"
          />
          <button 
            type="submit"
            disabled={isSearching}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-5 font-semibold transition-colors h-full flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Scraping...
              </>
            ) : 'Analyze'}
          </button>
        </form>

        {isSearching && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-xl font-medium mb-2 dark:text-white">Scraping Reviews</h3>
            <p>Please wait while we collect and analyze data. This might take 10-15 seconds.</p>
          </div>
        )}

        {result && !isSearching && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold dark:text-white">{result.product}</h3>
                <p className="text-slate-500">Based on {result.reviewsCount} reviews</p>
              </div>
              <div className="px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-xl font-bold text-lg">
                {result.positive}% Positive
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-8">
              <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">AI Summary</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                "{result.summary}"
              </p>
            </div>
            
            <div className="flex justify-end">
              <button className="text-blue-600 font-medium hover:underline">
                View Full Analytics &rarr;
              </button>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
