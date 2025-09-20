import { useState, useEffect } from 'react';
import { Award, Gift, Sparkles, Shield, RefreshCw } from 'lucide-react';

const API_BASE = import.meta.env?.VITE_API_BASE || window.__API_BASE__ || 'http://127.0.0.1:5000';

const initialBadges = [
  { id: 1, title: 'Plastic-Free Pro', desc: '5 plastic-free purchases', color: 'from-emerald-500 to-green-500', earned: false, progress: 3 },
  { id: 2, title: 'Local Supporter', desc: '3 local merchant orders', color: 'from-indigo-500 to-blue-500', earned: true, progress: 3 },
  { id: 3, title: 'Carbon Cutter', desc: 'Offset 10kg CO₂', color: 'from-amber-500 to-orange-500', earned: false, progress: 7 },
  { id: 4, title: 'Refill Rockstar', desc: 'Use refills 5 times', color: 'from-pink-500 to-rose-500', earned: true, progress: 5 },
];

const initialRewards = [
  { id: 1, title: '₹100 Coupon', req: 'Earn 2,000 points', icon: Gift, available: true, cost: 2000 },
  { id: 2, title: 'Free Shipping', req: 'Earn 5,000 points', icon: Shield, available: false, cost: 5000 },
  { id: 3, title: 'VIP Badge', req: 'Earn 10,000 points', icon: Award, available: false, cost: 10000 },
];

export default function Rewards() {
  const [badges, setBadges] = useState(initialBadges);
  const [rewards, setRewards] = useState(initialRewards);
  const [userPoints, setUserPoints] = useState(2450);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const redeemReward = async (rewardId) => {
    try {
      const reward = rewards.find(r => r.id === rewardId);
      if (!reward || !reward.available || userPoints < reward.cost) {
        alert('Not enough points or reward not available!');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserPoints(prev => prev - reward.cost);
      setRewards(prev => prev.map(r => 
        r.id === rewardId ? { ...r, available: false } : r
      ));
      
      alert(`Successfully redeemed ${reward.title}!`);
    } catch (error) {
      console.error('Failed to redeem reward:', error);
      alert('Failed to redeem reward. Please try again.');
    }
  };

  const refreshRewards = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update badge progress
      setBadges(prev => prev.map(badge => ({
        ...badge,
        progress: Math.min(badge.progress + Math.floor(Math.random() * 2), 10),
        earned: badge.progress >= 5
      })));
      
    } catch (error) {
      console.error('Failed to refresh rewards:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Auto-refresh every 5 minutes
    const interval = setInterval(refreshRewards, 300000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-3">
            <Sparkles className="text-emerald-600" /> Rewards & Badges
          </h1>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">{userPoints.toLocaleString()} pts</div>
            <button
              onClick={refreshRewards}
              disabled={isRefreshing}
              className="p-2 rounded-lg bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-700 transition-all duration-200 hover:shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Badges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {badges.map((b) => (
            <div key={b.id} className={`rounded-2xl p-5 shadow-sm border transform hover:scale-105 transition-all duration-300 hover:shadow-lg ${b.earned ? 'bg-green-50 border-green-200' : 'bg-white border-emerald-100'}`}>
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${b.color} text-white flex items-center justify-center mb-3 shadow-lg hover:shadow-xl transition-shadow ${b.earned ? 'animate-pulse' : ''}`}>
                <Award className="hover:scale-110 transition-transform" />
              </div>
              <div className="font-semibold text-gray-900">{b.title}</div>
              <div className="text-sm text-gray-600">{b.desc}</div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${b.earned ? 'bg-green-500' : 'bg-emerald-500'}`}
                    style={{ width: `${(b.progress / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{b.progress}/5</div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Redeemable Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewards.map((r) => (
            <div key={r.id} className={`rounded-2xl p-5 shadow-sm border flex items-center justify-between transform hover:scale-105 transition-all duration-300 hover:shadow-lg ${r.available ? 'bg-white border-emerald-100' : 'bg-gray-50 border-gray-200'}`}>
              <div>
                <div className="font-semibold text-gray-900">{r.title}</div>
                <div className="text-sm text-gray-600">{r.req}</div>
                <div className="text-xs text-emerald-600 mt-1">{r.cost.toLocaleString()} points</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow ${r.available ? 'bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                  <r.icon className="hover:scale-110 transition-transform" />
                </div>
                <button
                  onClick={() => redeemReward(r.id)}
                  disabled={!r.available || userPoints < r.cost}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    !r.available || userPoints < r.cost
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md'
                  }`}
                >
                  {!r.available ? 'Redeemed' : userPoints < r.cost ? 'Need Points' : 'Redeem'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <button 
            onClick={() => alert('Bulk redeem feature coming soon!')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
          >
            Bulk Redeem
          </button>
          <button 
            onClick={() => alert('Reward history coming soon!')}
            className="bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
          >
            View history
          </button>
        </div>
      </div>
    </div>
  );
}



