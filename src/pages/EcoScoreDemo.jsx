import React, { useState, useEffect } from 'react';
import EcoScoreLabel from '../components/EcoScoreLabel';
import EcoScoreDashboard from '../components/EcoScoreDashboard';
import { formatRupees } from '../utils/currency';
import './EcoScoreDemo.css';

const EcoScoreDemo = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [demoProducts, setDemoProducts] = useState([]);

  useEffect(() => {
    // Create demo products with EcoScores
    const products = [
      {
        id: 1,
        name: 'Organic Cotton T-Shirt',
        brand: 'EcoWear',
        price: 2499,
        category: 'Clothing',
        ecoscore_value: 85,
        ecoscore_grade: 'A',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        description: 'Made from 100% organic cotton, sustainably sourced and ethically produced.'
      },
      {
        id: 2,
        name: 'Bamboo Toothbrush',
        brand: 'GreenLife',
        price: 749,
        category: 'Personal Care',
        ecoscore_value: 92,
        ecoscore_grade: 'A',
        image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400',
        description: 'Biodegradable bamboo handle with soft bristles. Plastic-free packaging.'
      },
      {
        id: 3,
        name: 'LED Light Bulb',
        brand: 'EcoLight',
        price: 1084,
        category: 'Electronics',
        ecoscore_value: 78,
        ecoscore_grade: 'B',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        description: 'Energy-efficient LED bulb with 15-year lifespan. 80% less energy consumption.'
      },
      {
        id: 4,
        name: 'Plastic Water Bottle',
        brand: 'Convenience Co.',
        price: 333,
        category: 'Food & Beverages',
        ecoscore_value: 25,
        ecoscore_grade: 'D',
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
        description: 'Single-use plastic bottle. Not recommended for environmental impact.'
      },
      {
        id: 5,
        name: 'Reusable Glass Bottle',
        brand: 'PureGlass',
        price: 1584,
        category: 'Food & Beverages',
        ecoscore_value: 88,
        ecoscore_grade: 'A',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
        description: 'Durable glass bottle with silicone sleeve. 100% recyclable and reusable.'
      },
      {
        id: 6,
        name: 'Conventional T-Shirt',
        brand: 'FastFashion',
        price: 833,
        category: 'Clothing',
        ecoscore_value: 35,
        ecoscore_grade: 'D',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        description: 'Made from conventional cotton with synthetic dyes. High environmental impact.'
      }
    ];
    setDemoProducts(products);
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Products', icon: '🛍️' },
    { id: 'grades', label: 'Grade Guide', icon: '📋' }
  ];

  const renderGradeGuide = () => (
    <div className="grade-guide">
      <h2>EcoScore Grade Guide</h2>
      <p className="guide-description">
        EcoScore is calculated using Life Cycle Assessment (LCA) methodology, 
        mapping products to ecoinvent database processes and normalizing against 
        industry benchmarks.
      </p>
      
      <div className="grades-grid">
        {[
          { grade: 'A', score: '80-100', description: 'Highly Sustainable', details: 'Excellent environmental performance with minimal impact' },
          { grade: 'B', score: '60-79', description: 'Good', details: 'Good environmental performance with low impact' },
          { grade: 'C', score: '40-59', description: 'Average', details: 'Average environmental performance with moderate impact' },
          { grade: 'D', score: '20-39', description: 'Poor', details: 'Poor environmental performance with high impact' },
          { grade: 'E', score: '0-19', description: 'Very Poor', details: 'Very poor environmental performance with very high impact' }
        ].map(({ grade, score, description, details }) => (
          <div key={grade} className="grade-card">
            <EcoScoreLabel 
              score={parseInt(score.split('-')[0]) + 10} 
              grade={grade} 
              size="large"
              showDetails={true}
            />
            <div className="grade-info">
              <h3>Grade {grade}</h3>
              <p className="score-range">{score} points</p>
              <p className="description">{description}</p>
              <p className="details">{details}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="methodology">
        <h3>How EcoScore is Calculated</h3>
        <div className="methodology-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Product Mapping</h4>
              <p>Each product is mapped to the closest ecoinvent process based on materials, manufacturing, and category.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Impact Calculation</h4>
              <p>Life Cycle Assessment (LCA) calculates environmental impact using IPCC 2013 climate change methodology.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Normalization</h4>
              <p>Impact values are normalized against industry benchmarks for fair comparison across categories.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>Scoring</h4>
              <p>Normalized impacts are converted to 0-100 scale with letter grades for easy understanding.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="products-demo">
      <h2>Products with EcoScores</h2>
      <p className="demo-description">
        Here are some example products with their calculated EcoScores. 
        Notice how sustainable products score higher!
      </p>
      
      <div className="products-grid">
        {demoProducts.map((product) => (
          <div key={product.id} className="product-demo-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <div className="ecoscore-badge">
                <EcoScoreLabel 
                  score={product.ecoscore_value} 
                  grade={product.ecoscore_grade} 
                  size="small"
                />
              </div>
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="brand">{product.brand}</p>
              <p className="price">{formatRupees(product.price)}</p>
              <p className="description">{product.description}</p>
              <div className="ecoscore-details">
                <EcoScoreLabel 
                  score={product.ecoscore_value} 
                  grade={product.ecoscore_grade} 
                  size="medium"
                  showDetails={true}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="ecoscore-demo">
      <div className="demo-header">
        <h1>🌱 EcoScore System Demo</h1>
        <p>Experience how we label every product with environmental impact scores</p>
      </div>

      <div className="demo-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="demo-content">
        {activeTab === 'dashboard' && <EcoScoreDashboard />}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'grades' && renderGradeGuide()}
      </div>
    </div>
  );
};

export default EcoScoreDemo;
