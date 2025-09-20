import { useMemo, useState, useEffect } from 'react';
import { Crown, Medal, Star, Zap, RefreshCw } from 'lucide-react';

const API_BASE = import.meta.env?.VITE_API_BASE || window.__API_BASE__ || 'http://127.0.0.1:5000';

const mockLeaders = [
  { name: 'Aisha', points: 12850, streak: 23, badges: 8 },
  { name: 'Rahul', points: 11540, streak: 17, badges: 7 },
  { name: 'Priya', points: 10990, streak: 14, badges: 6 },
  { name: 'Vikram', points: 9800, streak: 10, badges: 5 },
  { name: 'Sara', points: 9100, streak: 9, badges: 5 },
];

export default function Leaderboards() {
  const [leaders, setLeaders] = useState(mockLeaders);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchLeaderboards = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call - replace with actual endpoint when available
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, we'll simulate dynamic updates by slightly modifying points
      const updatedLeaders = leaders.map(leader => ({
        ...leader,
        points: leader.points + Math.floor(Math.random() * 50),
        streak: leader.streak + (Math.random() > 0.7 ? 1 : 0)
      }));
      
      setLeaders(updatedLeaders);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch leaderboards:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLeaderboards, 30000);
    return () => clearInterval(interval);
  }, [leaders]);

  const podium = useMemo(() => leaders.slice(0, 3), [leaders]);
  const others = useMemo(() => leaders.slice(3), [leaders]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-emerald-200 blur-3xl opacity-30" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-lime-200 blur-3xl opacity-30" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <Crown className="text-amber-500" /> Eco Leaderboards
          </h1>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">Weekly</div>
            <button
              onClick={fetchLeaderboards}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-700 transition-all duration-200 hover:shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        {lastUpdated && (
          <div className="text-sm text-gray-500 mb-4">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}

          {/* Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {podium.map((p, i) => (
              <div key={p.name} className={`relative rounded-2xl p-6 shadow-lg border transform hover:scale-105 transition-all duration-300 hover:shadow-xl ${i===0 ? 'bg-gradient-to-br from-amber-50 to-yellow-100 border-amber-200 hover:from-amber-100 hover:to-yellow-200' : i===1 ? 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:from-slate-100 hover:to-slate-200' : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:from-orange-100 hover:to-amber-100'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {i===0 ? <Crown className="text-amber-500 animate-pulse" /> : <Medal className={`${i===1 ? 'text-slate-500' : 'text-orange-500'} hover:scale-110 transition-transform`} />}
                    <div>
                      <div className="text-lg font-bold text-gray-900">{p.name}</div>
                      <div className="text-sm text-gray-600">Streak {p.streak} days</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-emerald-700 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{p.points.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Eco Points</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-amber-700">
                  <Star size={16} className="fill-current animate-pulse" />
                  <span className="text-sm">Badges: {p.badges}</span>
                </div>
                <div className={`absolute -top-3 -right-3 rounded-full px-3 py-1 shadow-lg font-semibold text-sm ${i===0 ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white' : i===1 ? 'bg-gradient-to-r from-slate-400 to-slate-500 text-white' : 'bg-gradient-to-r from-orange-400 to-amber-500 text-white'}`}>
                  #{i+1}
                </div>
              </div>
            ))}
          </div>

          {/* Others */}
          <div className="bg-white/80 backdrop-blur border border-emerald-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
              <div className="font-semibold text-gray-900">Top Eco-Shoppers</div>
              <button 
                onClick={() => alert('Monthly leaderboard coming soon!')}
                className="text-emerald-700 hover:text-emerald-900 text-sm transition-colors"
              >
                View monthly
              </button>
            </div>
            <div className="divide-y divide-emerald-100">
              {others.map((p, idx) => (
                <div key={p.name} className="px-6 py-4 flex items-center justify-between hover:bg-emerald-50/40">
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center font-semibold text-gray-700">#{idx+4}</div>
                    <div>
                      <div className="font-medium text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-500">Streak {p.streak} days</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-sm text-gray-700">Badges {p.badges}</div>
                    <div className="font-bold text-emerald-700">{p.points.toLocaleString()} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap gap-3">
            <button 
              onClick={() => window.location.href = '#challenges'}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
            >
              <Zap size={18} /> Join daily challenge
            </button>
            <button 
              onClick={() => alert('Profile feature coming soon!')}
              className="bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
            >
              View my profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

