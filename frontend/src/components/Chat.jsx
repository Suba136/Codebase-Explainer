import React, { useEffect, useState, useRef } from 'react';
import './Chat.css';
import { Send, User, Bot, RefreshCw } from 'lucide-react';
import { chat } from '../lib/api';
import { useRepo } from '../context/RepoContext';
import ReactMarkdown from 'react-markdown';

const Chat = () => {
    const { repoId } = useRepo();
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I am your AI codebase assistant. How can I help you today?' }
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    
    // For auto-scrolling to the latest message
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || !repoId || loading) return;

        const userQuestion = inputText;
        
        // Add user message to UI
        setMessages(prev => [...prev, { role: 'user', text: userQuestion }]);
        setInputText('');
        setLoading(true);

        try {
            const response = await chat(repoId, userQuestion);
            
            // Add bot response to UI
            setMessages(prev => [...prev, { 
                role: 'bot', 
                text: response.answer || "I'm sorry, I couldn't process that." 
            }]);
        } catch (error) {
            setMessages(prev => [...prev, { 
                role: 'bot', 
                text: "Error: Could not connect to the server." 
            }]);
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="repo-page-container">
            <div className="repo-right-panel card">
                <div className="chat-interface">
                    <div className="chat-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message-bubble ${msg.role}`}>
                                <div className="message-icon">
                                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div className="message-text">
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        
                        {/* Thinking indicator */}
                        {loading && (
                            <div className="message-bubble bot">
                                <div className="message-icon"><Bot size={14} /></div>
                                <div className="message-text">AI is analyzing...</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-container">
                        <textarea
                            className="input chat-input"
                            placeholder={repoId ? "Ask about the codebase..." : "Select a repo first..."}
                            value={inputText}
                            disabled={!repoId || loading}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                        <button 
                            className="btn-primary send-btn" 
                            onClick={handleSendMessage}
                            disabled={loading || !inputText.trim()}
                        >
                            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;