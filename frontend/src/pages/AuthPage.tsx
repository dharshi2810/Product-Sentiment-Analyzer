import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Hexagon, Loader2 } from 'lucide-react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const endpoint = isLogin ? '/login' : '/register'
    const payload = isLogin ? { email, password } : { name, email, password }
    
    // In production on Vercel, VITE_API_URL is set. In dev, we fallback if needed.
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

    try {
      const res = await fetch(`${apiUrl}/auth${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed')
      }

      if (isLogin) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/dashboard')
      } else {
        // If registered successfully, switch to login
        setIsLogin(true)
        setError('Registration successful! Please sign in.')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel rounded-3xl overflow-hidden relative z-10"
      >
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <Hexagon className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-2 text-white text-glow">
            {isLogin ? 'Welcome Back' : 'Initialize Access'}
          </h2>
          <p className="text-slate-400 text-center mb-8">
            {isLogin ? 'Authenticate to access the neural network.' : 'Create your credentials.'}
          </p>

          {error && (
            <div className={`p-3 rounded-xl text-sm mb-6 ${error.includes('successful') ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Identifier (Name)</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Secure Comm Link (Email)</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Encryption Key (Password)</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] mt-6 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isLogin ? 'Establish Connection' : 'Register Protocol'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            {isLogin ? "No access codes? " : "Already initialized? "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }} 
              className="text-primary font-semibold hover:text-white transition-colors"
            >
              {isLogin ? 'Request access' : 'Authenticate here'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
