import React from 'react';
import './EcoScoreLabel.css';

const EcoScoreLabel = ({ 
  score, 
  grade, 
  showDetails = false, 
  size = 'medium',
  className = '' 
}) => {
  if (!score && !grade) {
    return null;
  }

  const getScoreConfig = (grade) => {
    const configs = {
      'A': {
        emoji: '🌱',
        label: 'Highly Sustainable',
        color: '#4CAF50',
        bgColor: '#E8F5E8',
        borderColor: '#4CAF50'
      },
      'B': {
        emoji: '♻️',
        label: 'Good',
        color: '#8BC34A',
        bgColor: '#F1F8E9',
        borderColor: '#8BC34A'
      },
      'C': {
        emoji: '⚖️',
        label: 'Average',
        color: '#FFC107',
        bgColor: '#FFFDE7',
        borderColor: '#FFC107'
      },
      'D': {
        emoji: '⚠️',
        label: 'Poor',
        color: '#FF9800',
        bgColor: '#FFF3E0',
        borderColor: '#FF9800'
      },
      'E': {
        emoji: '🚨',
        label: 'Very Poor',
        color: '#F44336',
        bgColor: '#FFEBEE',
        borderColor: '#F44336'
      }
    };
    return configs[grade] || configs['C'];
  };

  const config = getScoreConfig(grade);
  const sizeClasses = {
    small: 'ecoscore-small',
    medium: 'ecoscore-medium',
    large: 'ecoscore-large'
  };

  return (
    <div 
      className={`ecoscore-label ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
        color: config.color
      }}
      title={`EcoScore ${grade}: ${config.label} (${score}/100)`}
    >
      <span className="ecoscore-emoji">{config.emoji}</span>
      <span className="ecoscore-grade">EcoScore {grade}</span>
      {showDetails && (
        <div className="ecoscore-details">
          <div className="ecoscore-score">{score}/100</div>
          <div className="ecoscore-label-text">{config.label}</div>
        </div>
      )}
    </div>
  );
};

export default EcoScoreLabel;
