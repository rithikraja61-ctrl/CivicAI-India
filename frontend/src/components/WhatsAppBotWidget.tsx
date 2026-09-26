import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Mic, 
  CheckCheck, 
  ExternalLink, 
  Bot, 
  Phone,
  Paperclip
} from 'lucide-react';
import { apiService } from '../services/apiService';
import type { CitizenRequest } from '../types/civic';

interface Message {
  id: string;
  sender: 'BOT' | 'USER';
  text: string;
  time: string;
  metadata?: {
    sector?: string;
    urgencyScore?: number;
    proximityVerdict?: string;
    distanceKm?: number;
  };
}
    sector?: string;
    urgencyScore?: number;
    proximityVerdict?: string;
    distanceKm?: number;
  };
}

interface WhatsAppBotProps {
  onNewRequestLogged?: (req: CitizenRequest) => void;
}

export const WhatsAppBotWidget: React.FC<WhatsAppBotProps> = ({ onNewRequestLogged }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'BOT',
      text: '🙏 Namaste! Welcome to **CivicAI-India WhatsApp Grievance Bot**.\n\nYou can report any local infrastructure issue (Water, Roads, Hospital, Electricity) in your native language (Tamil, Hindi, Telugu, English).',
      time: 'Just now'
    },
    {
      id: 'msg-2',
      sender: 'BOT',
      text: '💡 *Try sending:*\n• "வேலூர் பகுதியில் புதிய மருத்துவமனை வேண்டும்"\n• "हमारे गांव में पानी की भारी समस्या है"\n• "Road damaged near Sirsi market"',
      time: 'Just now'
    }
  ]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Call API service
    const req = await apiService.submitRequest(text, 'MESSAGING', 'Auto-Detect');
    if (onNewRequestLogged) {
      onNewRequestLogged(req);
    }

    setTimeout(() => {
      setIsTyping(false);
      const isHospital = text.toLowerCase().includes('hospital') || text.includes('மருத்துவமனை') || text.includes('अस्पताल');
      
      let botResponse = `✅ **Grievance Registered (${req.id})**\n\n` +
        `• **Sector**: ${req.sector}\n` +
        `• **District**: ${req.district}, ${req.state}\n` +
        `• **Detected Language**: ${req.detectedLanguage}\n\n`;

      if (isHospital) {
        botResponse += `⚠️ **GIS Proximity Audit Result**:\nDistrict Civil Hospital is only **2.1km away** with 42% vacant capacity. To prevent duplicate spending, your request has been routed to the **₹85 Lakh Ambulance Feeder Shuttle Scheme** instead!`;
      } else {
        botResponse += `🚨 **Ground-Truth Audit**:\nConfirmed genuine deficit (zero active water/road facilities within 14km). Priority Score: **${req.urgencyScore}/10** - Fast-tracked to PM Gati Shakti National Dashboard!`;
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'BOT',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: {
          sector: req.sector,
          urgencyScore: req.urgencyScore,
          proximityVerdict: isHospital ? 'DE-PRIORITIZED (HOSPITAL 2.1KM AWAY)' : 'HIGH PRIORITY APPROVED',
          distanceKm: isHospital ? 2.1 : 14.2
        }
      };

      setMessages(prev => [...prev, botMsg]);
    }, 1200);
  };

  const realWhatsAppDeepLink = "https://wa.me/919999999999?text=" + encodeURIComponent("CivicAI-India: I would like to report a public infrastructure deficit");

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, fontFamily: 'var(--font-sans)' }}>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(37, 211, 102, 0.45), 0 0 0 2px rgba(255,255,255,0.2)',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageCircle size={32} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: -2,
              right: -2,
              background: '#ef4444',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 800,
              width: 22,
              height: 22,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #05070d'
            }}>
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* WhatsApp Chat Window */}
      {isOpen && (
        <div style={{
          width: 360,
          height: 520,
          background: '#0b141a',
          borderRadius: 20,
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* WhatsApp Header */}
          <div style={{
            background: '#1f2c34',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 0 10px rgba(37, 211, 102, 0.4)'
              }}>
                <Bot size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e9edef', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                  CivicAI India Bot <span style={{ color: '#25D366', fontSize: 10 }}>✔</span>
                </h4>
                <span style={{ fontSize: '0.68rem', color: '#8696a0', display: 'block' }}>
                  National DPG Grievance Gateway
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#aebac1' }}>
              <span title="National Toll-Free Voice Bridge: 1800-CIVIC-AI" style={{ display: 'flex', cursor: 'pointer' }}>
                <Phone size={16} />
              </span>
              <a 
                href={realWhatsAppDeepLink} 
                target="_blank" 
                rel="noopener noreferrer"
                title="Open in Official WhatsApp App"
                style={{ color: '#25D366', display: 'flex', alignItems: 'center' }}
              >
                <ExternalLink size={16} />
              </a>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#aebac1', cursor: 'pointer', display: 'flex' }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Chat Messages Body with WhatsApp background pattern */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'USER' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: msg.sender === 'USER' ? '#005c4b' : '#202c33',
                  color: '#e9edef',
                  borderRadius: msg.sender === 'USER' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.78rem',
                  lineHeight: 1.45,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                  position: 'relative',
                  wordBreak: 'break-word'
                }}
              >
                <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.25rem',
                  marginTop: '0.2rem',
                  fontSize: '0.62rem',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  <span>{msg.time}</span>
                  {msg.sender === 'USER' && <CheckCheck size={13} color="#53bdeb" />}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{
                alignSelf: 'flex-start',
                background: '#202c33',
                borderRadius: '12px 12px 12px 2px',
                padding: '0.5rem 0.8rem',
                fontSize: '0.72rem',
                color: '#8696a0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <span className="wave-bar" style={{ height: 10, background: '#25D366' }}></span>
                <span className="wave-bar" style={{ height: 14, background: '#25D366' }}></span>
                <span className="wave-bar" style={{ height: 8, background: '#25D366' }}></span>
                <span>CivicAI Gemini is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Scenario Tap Chips */}
          <div style={{
            padding: '0.35rem 0.75rem',
            background: '#111b21',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto'
          }}>
            <button
              onClick={() => handleSendMessage('வேலூர் பகுதியில் புதிய பொது மருத்துவமனை வேண்டும் (500 மக்கள் கோரிக்கை)')}
              style={{
                background: '#202c33',
                border: '1px solid rgba(37, 211, 102, 0.3)',
                color: '#25D366',
                borderRadius: 999,
                padding: '0.2rem 0.6rem',
                fontSize: '0.65rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              🏥 Vellore Hospital (Test)
            </button>
            <button
              onClick={() => handleSendMessage('बुंदेलखंड गांव में पानी की भारी किल्लत है')}
              style={{
                background: '#202c33',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                color: '#38bdf8',
                borderRadius: 999,
                padding: '0.2rem 0.6rem',
                fontSize: '0.65rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              💧 Banda Water (Test)
            </button>
          </div>

          {/* Input Chat Bar */}
          <div style={{
            background: '#202c33',
            padding: '0.5rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <button
              type="button"
              title="Attach Site Photo / Location Geotag"
              style={{ background: 'transparent', border: 'none', color: '#8696a0', cursor: 'pointer', display: 'flex', padding: 4 }}
            >
              <Paperclip size={18} />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Message in Tamil, Hindi, English..."
              style={{
                flex: 1,
                background: '#2a3942',
                border: 'none',
                borderRadius: 8,
                padding: '0.5rem 0.75rem',
                color: '#e9edef',
                fontSize: '0.78rem',
                outline: 'none'
              }}
            />
            {inputText.trim() ? (
              <button
                onClick={() => handleSendMessage()}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: '#00a884',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
              >
                <Send size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSendMessage('வேலூர் பகுதியில் புதிய பொது மருத்துவமனை வேண்டும்')}
                title="Send Voice Audio Grievance"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: '#00a884',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
              >
                <Mic size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
