import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Folder, File, ChevronRight, ChevronDown, 
  Send, User, Bot, Star, GitBranch, RefreshCw 
} from 'lucide-react';
import './Repo.css';

const Repo = () => {
  const { repoId } = useParams();
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your AI codebase assistant. How can I help you understand this repository today?' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { role: 'user', text: inputText }]);
    setInputText('');
    // Mock bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: `Analyzing your query about: "${inputText}"... This repository contains complex logic for data processing.` }]);
    }, 1000);
  };

  return (
    <div className="repo-page-container">
      <div className="repo-left-panel card">
        <div className="repo-metadata">
          <div className="repo-header-info">
            <h2 className="repo-title-text">{repoId}</h2>
            <div className="repo-badges">
              <span className="badge">JavaScript</span>
              <div className="repo-stat">
                <Star size={14} />
                <span>1.2k</span>
              </div>
              <div className="repo-stat">
                <GitBranch size={14} />
                <span>254</span>
              </div>
            </div>
            <p className="repo-updated-text">Updated 2 hours ago</p>
          </div>
          <button className="btn-secondary btn-icon-only">
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="file-tree-container card-inset">
          <div className="file-tree-item">
            <ChevronDown size={16} className="chevron" />
            <Folder size={16} className="folder-icon" />
            <span className="file-name">src</span>
          </div>
          <div className="file-tree-item nested">
            <ChevronRight size={16} className="chevron" />
            <Folder size={16} className="folder-icon" />
            <span className="file-name">components</span>
          </div>
          <div className="file-tree-item nested-2">
            <File size={16} className="file-icon" />
            <span className="file-name">App.jsx</span>
          </div>
          <div className="file-tree-item nested-2 active">
            <File size={16} className="file-icon" />
            <span className="file-name">Repo.jsx</span>
          </div>
          <div className="file-tree-item nested">
            <File size={16} className="file-icon" />
            <span className="file-name">index.css</span>
          </div>
          <div className="file-tree-item">
            <File size={16} className="file-icon" />
            <span className="file-name">package.json</span>
          </div>
        </div>
      </div>

      <div className="repo-right-panel card">
        <div className="chat-interface">
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-bubble ${msg.role}`}>
                <div className="message-icon">
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className="message-text">{msg.text}</div>
              </div>
            ))}
          </div>
          
          <div className="chat-input-container">
            <textarea 
              className="input chat-input" 
              placeholder="Ask anything about the codebase..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button className="btn-primary send-btn" onClick={handleSendMessage}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Repo;
