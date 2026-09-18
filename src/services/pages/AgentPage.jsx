import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';
import { apiClient } from '../../api/client';

const SUGGESTED_QUESTIONS = [
  'What are the current mission risks?',
  'Will our fuel last until resupply?',
  'Which cargo is most urgent?',
  'Which assets need maintenance?',
  'What happens if cargo is delayed 10 days?'
];

export default function AgentPage({ isOffline }) {
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: "Polar Command Tactical AI initialized. I monitor telemetry across Arctic and Antarctic bases, calculating supply chain burn rates and predictive failure risks. Select a quick query below or type your inquiry.",
      timestamp: 'Online'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendQuery = async (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim() || loading) return;

    const userMsg = {
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      if (isOffline) {
        // Offline fallback answers
        setTimeout(() => {
          let reply = "Offline Mode: Telemetry cached locally. Fuel duration 16.7 days vs 25-day resupply. Recommendation: Prioritize resupply.";
          if (q.toLowerCase().includes('risk')) {
            reply = "Current Mission Risk Status: OVERALL RISK: HIGH.\n\nKey Vulnerabilities: Fuel shortage (16.7d), G-04 generator overdue, Cargo POLAR-2026-00451 delayed.";
          } else if (q.toLowerCase().includes('cargo')) {
            reply = "Most Urgent Cargo: POLAR-2026-00451 (Critical Generator Spare). Status: DELAYED in Indian Ocean Transit.";
          }
          setMessages(prev => [...prev, {
            sender: 'agent',
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
          setLoading(false);
        }, 500);
        return;
      }

      const res = await apiClient.post('/agent/query', { query: q });
      const agentMsg = {
        sender: 'agent',
        text: res.data.response,
        recommendations: res.data.recommendations,
        mode: res.data.mode,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'agent',
        text: "Error contacting decision engine. Operating on offline heuristics.",
        timestamp: 'Offline Fallback'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 110px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={26} color="var(--accent-cyan)" />
            <h1 className="font-hud" style={{ fontSize: '1.6rem', color: '#ffffff', letterSpacing: '0.06em' }}>
              🤖 AI OPERATIONS AGENT
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
            <span className="badge-tag badge-cyan">
              DEMO AI / RULE-BASED DECISION SUPPORT
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              Real-time tactical decision logic & operational risk diagnostics
            </span>
          </div>
        </div>
      </div>

      {/* Suggested Questions Bar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {SUGGESTED_QUESTIONS.map((sq) => (
          <button
            key={sq}
            onClick={() => handleSendQuery(sq)}
            className="hud-card"
            style={{
              padding: '8px 14px',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              background: 'rgba(15, 23, 42, 0.7)',
              color: '#e2e8f0',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={13} color="var(--accent-cyan)" />
            <span>{sq}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="hud-card" style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div className="hud-corner-tl"></div>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              gap: '12px',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            {msg.sender === 'agent' && (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                background: 'rgba(0, 240, 255, 0.15)',
                border: '1px solid var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bot size={20} color="var(--accent-cyan)" />
              </div>
            )}

            <div style={{
              background: msg.sender === 'user' ? 'rgba(2, 132, 199, 0.25)' : 'rgba(11, 19, 36, 0.9)',
              border: msg.sender === 'user' ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '8px',
              padding: '14px 16px',
              color: '#f1f5f9'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="font-hud" style={{ fontSize: '0.75rem', color: msg.sender === 'user' ? '#38bdf8' : 'var(--accent-cyan)', fontWeight: 700 }}>
                  {msg.sender === 'user' ? 'EXPEDITION CONTROLLER' : 'POLAR COMMAND AI'}
                </span>
                <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {msg.timestamp}
                </span>
              </div>

              <div style={{ fontSize: '0.88rem', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {msg.text}
              </div>

              {msg.recommendations && msg.recommendations.length > 0 && (
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '6px' }}>
                    TACTICAL RECOMMENDATIONS:
                  </div>
                  {msg.recommendations.map((rec, rIdx) => (
                    <div key={rIdx} style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                      <CheckCircle size={12} color="#10b981" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.2)',
                border: '1px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User size={20} color="#38bdf8" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              background: 'rgba(0, 240, 255, 0.15)',
              border: '1px solid var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={20} color="var(--accent-cyan)" />
            </div>
            <div className="font-hud" style={{ padding: '12px', color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
              CALCULATING DECISION LOGIC...
            </div>
          </div>
        )}
      </div>

      {/* Query Input Bar */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendQuery(); }} style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask AI Operations Agent about fuel burn, cargo delays, asset redundancy..."
          style={{
            flex: 1,
            background: 'rgba(13, 22, 38, 0.9)',
            border: '1px solid var(--border-card)',
            color: '#ffffff',
            padding: '12px 16px',
            borderRadius: '6px',
            fontSize: '0.9rem',
            outline: 'none',
            fontFamily: 'var(--font-sans)'
          }}
        />
        <button type="submit" className="btn-tactical" disabled={loading} style={{ padding: '0 24px' }}>
          <Send size={16} />
          <span>TRANSMIT</span>
        </button>
      </form>
    </div>
  );
}
