import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, BarChart2, Search, MessageSquare, ShieldCheck } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-xl tracking-tight">SentiAI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth" className="text-sm font-medium hover:text-blue-600 transition-colors">Sign In</Link>
              <Link to="/auth" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            V1.0 is now live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Decode Product Reviews with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">AI Precision</span>
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto">
            Stop guessing what customers think. Our enterprise-grade sentiment analyzer scrapes thousands of reviews in seconds and visualizes the true emotion behind every purchase.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover:scale-105">
              Start Analyzing <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="#features" className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-sm">
              View Demo
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div id="features" className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <FeatureCard 
            icon={<Search className="w-6 h-6 text-blue-600" />}
            title="Dynamic Web Scraping"
            description="Fetch reviews in real-time from Amazon and Flipkart using undetected Chrome instances."
          />
          <FeatureCard 
            icon={<MessageSquare className="w-6 h-6 text-blue-600" />}
            title="NLP Sentiment Analysis"
            description="Powered by TextBlob and VADER to accurately classify emotion into positive, neutral, and negative."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-blue-600" />}
            title="Enterprise Ready"
            description="JWT authentication, MongoDB Atlas integration, and clean scalable REST APIs."
          />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>© 2026 Product Sentiment Analyzer. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  )
}
