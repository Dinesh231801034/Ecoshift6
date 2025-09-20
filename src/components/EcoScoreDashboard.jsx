import React, { useState, useEffect } from 'react';
import EcoScoreLabel from './EcoScoreLabel';
import './EcoScoreDashboard.css';

const EcoScoreDashboard = () => {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEcoScoreData();
  }, []);

  const fetchEcoScoreData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await fetch('/api/ecoscore/ecoscores/stats/');
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch leaderboard
      const leaderboardResponse = await fetch('/api/ecoscore/ecoscores/leaderboard/');
      const leaderboardData = await leaderboardResponse.json();
      setLeaderboard(leaderboardData);

      // Fetch user achievements (if authenticated)
      const token = localStorage.getItem('access_token');
      if (token) {
        const achievementsResponse = await fetch('/api/ecoscore/achievements/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (achievementsResponse.ok) {
          const achievementsData = await achievementsResponse.json();
          setAchievements(achievementsData);
        }
      }
    } catch (error) {
      console.error('Error fetching EcoScore data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeDistribution = () => {
    if (!stats?.grade_distribution) return [];
    
    return Object.entries(stats.grade_distribution).map(([grade, count]) => ({
      grade,
      count,
      percentage: stats.products_with_ecoscore > 0 
        ? Math.round((count / stats.products_with_ecoscore) * 100) 
        : 0
    }));
  };

  if (loading) {
    return (
      <div className="ecoscore-dashboard">
        <div className="ecoscore-loading">
          <div className="loading-spinner"></div>
          <p>Loading EcoScore data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ecoscore-dashboard">
      <div className="ecoscore-header">
        <h2>🌱 EcoScore Dashboard</h2>
        <p>Track environmental impact and sustainability metrics</p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="ecoscore-stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.total_products}</h3>
              <p>Total Products</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🌱</div>
            <div className="stat-content">
              <h3>{stats.products_with_ecoscore}</h3>
              <p>With EcoScore</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>{stats.average_ecoscore}</h3>
              <p>Average Score</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <h3>{stats.recent_calculations}</h3>
              <p>Recent Updates</p>
            </div>
          </div>
        </div>
      )}

      {/* Grade Distribution */}
      {stats && (
        <div className="ecoscore-section">
          <h3>Grade Distribution</h3>
          <div className="grade-distribution">
            {getGradeDistribution().map(({ grade, count, percentage }) => (
              <div key={grade} className="grade-item">
                <EcoScoreLabel grade={grade} size="small" />
                <div className="grade-stats">
                  <span className="grade-count">{count} products</span>
                  <span className="grade-percentage">{percentage}%</span>
                </div>
                <div className="grade-bar">
                  <div 
                    className="grade-bar-fill" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Categories */}
      {stats?.top_performing_categories && (
        <div className="ecoscore-section">
          <h3>Top Performing Categories</h3>
          <div className="categories-list">
            {stats.top_performing_categories.map((category, index) => (
              <div key={category} className="category-item">
                <span className="category-rank">#{index + 1}</span>
                <span className="category-name">{category}</span>
                <EcoScoreLabel grade="A" size="small" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Achievements */}
      {achievements.length > 0 && (
        <div className="ecoscore-section">
          <h3>Your Achievements</h3>
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="achievement-card">
                <div className="achievement-icon">{achievement.badge_icon}</div>
                <div className="achievement-content">
                  <h4>{achievement.achievement_name}</h4>
                  <p>{achievement.description}</p>
                  <div className="achievement-metrics">
                    <span>CO2 Saved: {achievement.total_co2_saved.toFixed(1)} kg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {leaderboard.length > 0 && (
        <div className="ecoscore-section">
          <h3>Eco Champions Leaderboard</h3>
          <div className="leaderboard">
            {leaderboard.map((user, index) => (
              <div key={user.user_id} className="leaderboard-item">
                <div className="leaderboard-rank">#{user.rank}</div>
                <div className="leaderboard-user">
                  <span className="user-email">{user.user_email}</span>
                  <span className="user-stats">
                    {user.eco_achievements_count} achievements • {user.total_co2_saved.toFixed(1)} kg CO2 saved
                  </span>
                </div>
                <div className="leaderboard-score">
                  <EcoScoreLabel grade="A" size="small" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EcoScoreDashboard;
