import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Hexagon, Search, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 glass-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <Hexagon className="w-8 h-8 text-primary" />
              <span className="font-black text-2xl tracking-tight text-white">Senti<span className="text-primary">AI</span></span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/auth" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Initialize Access</Link>
              <Link to="/auth" className="bg-primary hover:bg-primary/80 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                Boot System
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            Neural Engine V1.0 Online
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-white leading-tight">
            Decode Sentiment with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 text-glow">
              AI Precision
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Stop guessing. Deploy our neural scraper to extract real-time data from Flipkart and visualize the true emotion behind every purchase instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/auth" className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              Initialize Scraper <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="#features" className="inline-flex items-center justify-center gap-2 glass-card text-white px-8 py-4 rounded-full text-lg font-bold transition-all hover:bg-white/5">
              View Specs
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div id="features" className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <FeatureCard 
            icon={<Search className="w-6 h-6 text-primary" />}
            title="Dynamic Extraction"
            description="Fetch reviews in real-time bypassing basic anti-bot protections using undetected headless instances."
          />
          <FeatureCard 
            icon={<MessageSquare className="w-6 h-6 text-primary" />}
            title="Neural NLP Engine"
            description="Powered by TextBlob and VADER to accurately classify human emotion into quantifiable metrics."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-primary" />}
            title="Enterprise Security"
            description="Encrypted JWT authentication pipelines, MongoDB Atlas scaling, and clean REST architecture."
          />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-slate-600 text-sm relative z-10">
        <p>© 2026 SentiAI Systems. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl glass-card relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] group-hover:bg-primary/20 transition-colors" />
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white relative z-10">{title}</h3>
      <p className="text-slate-400 relative z-10 leading-relaxed">{description}</p>
    </motion.div>
  )
}
