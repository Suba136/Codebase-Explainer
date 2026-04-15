import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Upload, Code2, Sparkles } from 'lucide-react';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="hero-section">
        <h1 className="hero-title">Understand Any Codebase.</h1>
        <p className="hero-subtitle">Ingest. Analyze. Chat.</p>
        
        <div className="hero-ctas">
          <Link to="/get-repo" className="btn-primary">
            <Rocket size={18} />
            Explore a Repo
          </Link>
        </div>

        <div className="stat-pills">
          <div className="stat-pill">
            <Code2 size={14} className="stat-icon" />
            <span>12k repos analyzed</span>
          </div>
          <div className="stat-pill">
            <Sparkles size={14} className="stat-icon" />
            <span>99ms avg response</span>
          </div>
          <div className="stat-pill">
            <div className="status-dot-container">
              <div className="status-dot"></div>
            </div>
            <span>GPT-4o powered</span>
          </div>
        </div>
      </div>
      
      <div className="circuit-background">
        {/* SVG background or animated elements could go here */}
      </div>
    </div>
  );
};

export default Landing;
