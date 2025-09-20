import { useState, useEffect } from 'react';
import { Flame, Leaf, CheckCircle2, Target, Trophy, RefreshCw } from 'lucide-react';

const API_BASE = import.meta.env?.VITE_API_BASE || window.__API_BASE__ || 'http://127.0.0.1:5000';

const initialDaily = [
  { id: 1, title: 'Refill instead of buying new', pts: 150, completed: false },
  { id: 2, title: 'Buy a plastic-free item', pts: 200, completed: false },
  { id: 3, title: 'Support a local merchant', pts: 250, completed: false },
];

const initialWeekly = [
  { id: 4, title: 'Offset 2kg CO₂', pts: 500, completed: false },
  { id: 5, title: 'Earn 3 eco badges', pts: 800, completed: false },
  { id: 6, title: 'Complete 5 orders', pts: 1000, completed: false },
];

export default function Challenges() {
  const [daily, setDaily] = useState(initialDaily);
  const [weekly, setWeekly] = useState(initialWeekly);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(7);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const claimChallenge = async (challengeId, isWeekly = false) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const challenge = isWeekly 
        ? weekly.find(c => c.id === challengeId)
        : daily.find(c => c.id === challengeId);
      
      if (challenge && !challenge.completed) {
        // Update local state
        if (isWeekly) {
          setWeekly(prev => prev.map(c => 
            c.id === challengeId ? { ...c, completed: true } : c
          ));
        } else {
          setDaily(prev => prev.map(c => 
            c.id === challengeId ? { ...c, completed: true } : c
          ));
        }
        
        setTotalPoints(prev => prev + challenge.pts);
        alert(`Claimed ${challenge.pts} points for: ${challenge.title}`);
      }
    } catch (error) {
      console.error('Failed to claim challenge:', error);
      alert('Failed to claim challenge. Please try again.');
    }
  };

  const refreshChallenges = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset daily challenges (they reset daily)
      setDaily(initialDaily);
      
      // Weekly challenges persist
      // In a real app, you'd fetch from API
      
    } catch (error) {
      console.error('Failed to refresh challenges:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Auto-refresh challenges every hour
    const interval = setInterval(refreshChallenges, 3600000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <Target className="text-emerald-600" /> Daily & Weekly Challenges
          </h1>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm flex items-center gap-2">
              <Flame className="text-orange-500" /> {streak}-day streak
            </div>
            <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
              {totalPoints} pts earned
            </div>
            <button
              onClick={refreshChallenges}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-700 transition-all duration-200 hover:shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-white shadow-sm border border-emerald-100 overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
            <div className="px-6 py-4 border-b border-emerald-100 flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50">
              <Leaf className="text-emerald-600 animate-pulse" />
              <div className="font-semibold text-gray-900">Daily</div>
            </div>
            <div className="p-4 space-y-3">
              {daily.map((c) => (
                <div key={c.id} className={`p-4 rounded-xl border flex items-center justify-between hover:bg-emerald-50/40 transform hover:scale-102 transition-all duration-200 ${c.completed ? 'border-green-300 bg-green-50' : 'border-emerald-100'}`}>
                  <div className="font-medium text-gray-900">{c.title}</div>
                  <div className="flex items-center gap-3">
                    <div className="text-emerald-700 font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">+{c.pts} pts</div>
                    <button 
                      onClick={() => claimChallenge(c.id, false)}
                      disabled={c.completed}
                      className={`px-3 py-1 rounded-lg text-white text-sm flex items-center gap-1 transition-all duration-200 hover:shadow-md hover:scale-105 ${
                        c.completed 
                          ? 'bg-green-500 cursor-not-allowed' 
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      <CheckCircle2 size={16} /> {c.completed ? 'Claimed' : 'Claim'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-sm border border-emerald-100 overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
            <div className="px-6 py-4 border-b border-emerald-100 flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50">
              <Trophy className="text-amber-500 animate-pulse" />
              <div className="font-semibold text-gray-900">Weekly</div>
            </div>
            <div className="p-4 space-y-3">
              {weekly.map((c) => (
                <div key={c.id} className={`p-4 rounded-xl border flex items-center justify-between hover:bg-emerald-50/40 transform hover:scale-102 transition-all duration-200 ${c.completed ? 'border-green-300 bg-green-50' : 'border-emerald-100'}`}>
                  <div className="font-medium text-gray-900">{c.title}</div>
                  <div className="flex items-center gap-3">
                    <div className="text-emerald-700 font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">+{c.pts} pts</div>
                    <button 
                      onClick={() => claimChallenge(c.id, true)}
                      disabled={c.completed}
                      className={`px-3 py-1 rounded-lg text-white text-sm flex items-center gap-1 transition-all duration-200 hover:shadow-md hover:scale-105 ${
                        c.completed 
                          ? 'bg-green-500 cursor-not-allowed' 
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      <CheckCircle2 size={16} /> {c.completed ? 'Claimed' : 'Claim'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



