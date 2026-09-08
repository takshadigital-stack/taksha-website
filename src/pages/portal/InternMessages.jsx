import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import SEO from '../../components/SEO/SEO';
import { useAuth } from '../../context/AuthContext';
import { Send, User } from 'lucide-react';
import './Messages.css';

export default function InternMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  
  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    if (user?.mentorId) {
      fetchMessages();
    }
  }, [user, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem('taksha_token');
      const res = await axios.get(`${API_URL}/messages/${user.mentorId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  }, [API_URL, user?.mentorId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.mentorId) return;

    setIsSending(true);
    try {
      const token = localStorage.getItem('taksha_token');
      const res = await axios.post(`${API_URL}/messages`, {
        receiverId: user.mentorId,
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

  return (
    <>
      <SEO title="Messages | Taksha Nexus Workspace" />
      <div>
        <header className="intern-tasks__header" style={{ marginBottom: 'var(--space-6)' }}>
          <div>
            <h1 className="intern-tasks__title">Messages</h1>
            <p className="intern-tasks__subtitle">Direct communication with your Lead Mentor.</p>
          </div>
        </header>

        <div className="messages-container">
          <div className="chat-area">
            <div className="chat-header">
              <User size={20} />
              Lead Mentor
            </div>
            
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: '20px' }}>
                  No messages yet. Say hello!
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
          </div>
        </div>
      </div>
    </>
  );
}
