import DashboardLayout from '../layouts/DashboardLayout'
import { Activity, Star, ThumbsUp, ThumbsDown } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const mockData = [
  { name: 'Mon', positive: 4000, negative: 2400 },
  { name: 'Tue', positive: 3000, negative: 1398 },
  { name: 'Wed', positive: 2000, negative: 9800 },
  { name: 'Thu', positive: 2780, negative: 3908 },
  { name: 'Fri', positive: 1890, negative: 4800 },
  { name: 'Sat', positive: 2390, negative: 3800 },
  { name: 'Sun', positive: 3490, negative: 4300 },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Reviews Analyzed" value="12,405" icon={<Activity className="text-blue-500" />} trend="+12% from last week" />
          <StatCard title="Average Rating" value="4.2/5" icon={<Star className="text-yellow-500" />} trend="Consistent" />
          <StatCard title="Positive Sentiment" value="78%" icon={<ThumbsUp className="text-green-500" />} trend="+5% from last week" />
          <StatCard title="Negative Sentiment" value="14%" icon={<ThumbsDown className="text-red-500" />} trend="-2% from last week" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Sentiment Trends (Last 7 Days)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="positive" stroke="#10b981" fillOpacity={1} fill="url(#colorPos)" />
                  <Area type="monotone" dataKey="negative" stroke="#ef4444" fillOpacity={1} fill="url(#colorNeg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Recent Searches</h3>
            <div className="flex-1 flex flex-col gap-4">
              <RecentSearchItem keyword="Samsung Galaxy S25" date="2 mins ago" status="Success" />
              <RecentSearchItem keyword="iPhone 15 Pro" date="1 hour ago" status="Success" />
              <RecentSearchItem keyword="Sony WH-1000XM5" date="3 hours ago" status="Success" />
              <RecentSearchItem keyword="MacBook Air M3" date="Yesterday" status="Success" />
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

function StatCard({ title, value, icon, trend }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-slate-500 dark:text-slate-400 font-medium text-sm">{title}</h4>
        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">{icon}</div>
      </div>
      <div className="text-3xl font-bold dark:text-white mb-1">{value}</div>
      <div className="text-xs text-slate-400 font-medium">{trend}</div>
    </div>
  )
}

function RecentSearchItem({ keyword, date, status }: any) {
  return (
    <div className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
      <div>
        <div className="font-semibold text-sm dark:text-slate-200">{keyword}</div>
        <div className="text-xs text-slate-400">{date}</div>
      </div>
      <div className="text-xs font-medium px-2 py-1 rounded-md bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        {status}
      </div>
    </div>
  )
}
