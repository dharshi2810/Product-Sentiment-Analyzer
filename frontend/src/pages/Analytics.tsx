import DashboardLayout from '../layouts/DashboardLayout'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts'

const data = [
  { name: 'Positive', value: 80 },
  { name: 'Negative', value: 15 },
  { name: 'Neutral', value: 5 },
];
const COLORS = ['#10b981', '#ef4444', '#f59e0b'];

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Sentiment Analytics</h2>
        <p className="text-slate-500">Deep dive into customer sentiment distribution.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sentiment Distribution Pie */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Overall Sentiment</h3>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Keyword Insights */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Trending Keywords (Word Cloud)</h3>
          <div className="flex-1 flex flex-wrap content-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            {/* Mock Word Cloud */}
            <span className="text-4xl font-bold text-blue-600">Battery</span>
            <span className="text-2xl font-semibold text-green-500">Display</span>
            <span className="text-5xl font-extrabold text-blue-800 dark:text-blue-400">Camera</span>
            <span className="text-xl font-medium text-red-500">Heating</span>
            <span className="text-3xl font-bold text-indigo-500">Performance</span>
            <span className="text-lg text-slate-500">Price</span>
            <span className="text-2xl font-semibold text-emerald-500">Value</span>
            <span className="text-xl font-medium text-blue-500">Design</span>
            <span className="text-sm text-slate-400">Charger</span>
            <span className="text-lg text-orange-500">Software</span>
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Key Takeaways</h4>
            <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>Camera and Battery are the most discussed positive features.</li>
              <li>Heating issues are the primary driver of negative sentiment.</li>
            </ul>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
