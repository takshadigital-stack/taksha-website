import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import SEO from '../../components/SEO/SEO';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Send, User } from 'lucide-react';
import './Messages.css';

export default function MentorMessages() {
  const { user } = useAuth();
  const { interns } = useWorkspace();
  const [activeInternId, setActiveInternId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  
  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    if (interns.length > 0 && !activeInternId) {
      setActiveInternId(interns[0].id);
    }
  }, [interns, activeInternId]);

  useEffect(() => {
    if (activeInternId) {
      fetchMessages(activeInternId);
    }
  }, [activeInternId, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = useCallback(async (internId) => {
    try {
      const token = localStorage.getItem('taksha_token');
      const res = await axios.get(`${API_URL}/messages/${internId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  }, [API_URL]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeInternId) return;

    setIsSending(true);
    try {
      const token = localStorage.getItem('taksha_token');
      const res = await axios.post(`${API_URL}/messages`, {
        receiverId: activeInternId,
        content: newMessage
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const activeIntern = interns.find(i => i.id === activeInternId);

  return (
    <>
      <SEO title="Messages | Taksha Nexus Workspace" />
      <div>
        <header className="intern-tasks__header" style={{ marginBottom: 'var(--space-6)' }}>
          <div>
            <h1 className="intern-tasks__title">Intern Messages</h1>
            <p className="intern-tasks__subtitle">Direct communication with your assigned interns.</p>
          </div>
        </header>

        <div className="messages-container mentor-messages-layout">
          <div className="messages-sidebar">
            <div className="messages-sidebar-header">
              Your Interns
            </div>
            <div className="intern-list">
              {interns.map(intern => (
                <div 
                  key={intern.id} 
                  className={`intern-item ${activeInternId === intern.id ? 'active' : ''}`}
                  onClick={() => setActiveInternId(intern.id)}
                >
                  <div className="intern-name">{intern.name}</div>
                  <div className="intern-track">{intern.track || 'Intern'}</div>
                </div>
              ))}
              {interns.length === 0 && (
                <div style={{ padding: 'var(--space-4)', color: 'var(--color-text-secondary)' }}>
                  No interns assigned.
                </div>
              )}
            </div>
          </div>

          <div className="chat-area">
            {activeInternId ? (
              <>
                <div className="chat-header">
                  <User size={20} />
                  {activeIntern?.name}
                </div>
                
                <div className="chat-messages">
                  {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: '20px' }}>
                      No messages yet. Send a message to start the conversation!
                    </div>
                  ) : (
                    messages.map(msg => (
                      <div key={msg.id} className={`message-bubble ${msg.senderId === user.id ? 'sent' : 'received'}`}>
                        <div className="message-content">{msg.content}</div>
                        <div className="message-time">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <form className="chat-input-area" onSubmit={handleSend}>
                  <textarea 
                    className="chat-input"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                  />
                  <button type="submit" className="chat-send-btn" disabled={!newMessage.trim() || isSending}>
                    <Send size={20} />
                  </button>
                </form>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-secondary)' }}>
                Select an intern to view messages
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
