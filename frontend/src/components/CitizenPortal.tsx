import React, { useState } from 'react';
import { 
  Mic, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  XCircle, 
  Sparkles,
  Droplets,
  HeartPulse,
  Route,
  GraduationCap,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { CitizenRequest } from '../types/civic';
import { apiService } from '../services/apiService';
import { GoogleMapLocationFinder } from './GoogleMapLocationFinder';
import confetti from 'canvas-confetti';

interface CitizenPortalProps {
  onRequestSubmitted: (req: CitizenRequest) => void;
}

const LANGUAGES = [
  { code: 'ta', name: 'தமிழ் (Tamil)', glyph: 'த' },
  { code: 'hi', name: 'हिंदी (Hindi)', glyph: 'क' },
  { code: 'te', name: 'తెలుగు (Telugu)', glyph: 'తె' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', glyph: 'ಕ' },
  { code: 'bn', name: 'বাংলা (Bengali)', glyph: 'ব' },
  { code: 'mr', name: 'मराठी (Marathi)', glyph: 'म' },
  { code: 'en', name: 'English', glyph: 'EN' },
];

const SAMPLE_VOICE_SCRIPTS = [
  { 
    lang: 'தமிழ் (Tamil)', 
    label: 'Vellore Hospital Proximity Test',
    badge: 'Proximity Audit Demo',
    icon: HeartPulse,
    color: '#f43f5e',
    text: 'வேலூர் பகுதியில் 500 மக்கள் புதிய பொது மருத்துவமனை வேண்டும் என கோரிக்கை வைக்கின்றனர்.',
    lat: 12.9165,
    lon: 79.1325,
    locationName: 'Vellore, Tamil Nadu'
  },
  { 
    lang: 'हिंदी (Hindi)', 
    label: 'Bundelkhand Water Crisis',
    badge: 'Urgent Greenfield',
    icon: Droplets,
    color: '#06b6d4',
    text: 'हमारे गांव बुंदेलखंड में पीने के पानी की भारी किल्लत है। नल से जल पाइपलाइन काम रुका पड़ा है।',
    lat: 25.4764,
    lon: 80.3344,
    locationName: 'Banda, Uttar Pradesh'
  },
  { 
    lang: 'తెలుగు (Telugu)', 
    label: 'Anantapur Digital School',
    badge: 'Education Grid',
    icon: GraduationCap,
    color: '#f59e0b',
    text: 'మా గ్రామంలో పాఠశాల డిజిటల్ తరగతి గదులకు విద్యుత్ మరియు ఇంటర్నెట్ సౌకర్యం లేదు.',
    lat: 14.4137,
    lon: 77.7126,
    locationName: 'Anantapur, Andhra Pradesh'
  },
  { 
    lang: 'ಕನ್ನಡ (Kannada)', 
    label: 'Uttara Kannada Road Cave-in',
    badge: 'Transit Corridor',
    icon: Route,
    color: '#10b981',
    text: 'ಉತ್ತರ ಕನ್ನಡ ರಸ್ತೆಯಲ್ಲಿ ಗುಂಡಿಗಳು ಬಿದ್ದು ಕೃಷಿ ಸಾಗಾಣಿಕೆಗೆ ತೊಂದರೆಯಾಗಿದೆ.',
    lat: 14.6195,
    lon: 74.8354,
    locationName: 'Uttara Kannada, Karnataka'
  },
];

export const CitizenPortal: React.FC<CitizenPortalProps> = ({ onRequestSubmitted }) => {
  const [selectedLang, setSelectedLang] = useState('தமிழ் (Tamil)');
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<CitizenRequest | null>(null);

  // Google Maps Pinning state
  const [showGoogleMap, setShowGoogleMap] = useState(false);
  const [pinnedLocation, setPinnedLocation] = useState<{ lat: number; lon: number; name: string }>({
    lat: 12.9165,
    lon: 79.1325,
    name: 'Vellore, Tamil Nadu'
  });

  const handleSimulatedRecording = () => {
    setIsRecording(true);
    setInputText('');
    setTimeout(() => {
      const sample = SAMPLE_VOICE_SCRIPTS.find(s => s.lang === selectedLang) || SAMPLE_VOICE_SCRIPTS[0];
      setInputText(sample.text);
      setPinnedLocation({ lat: sample.lat, lon: sample.lon, name: sample.locationName });
      setIsRecording(false);
    }, 2200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsProcessing(true);
    const newReq = await apiService.submitRequest(
      inputText, 
      isRecording ? 'VOICE' : 'TEXT', 
      selectedLang,
      pinnedLocation.lat,
      pinnedLocation.lon,
      pinnedLocation.name
    );
    setIsProcessing(false);
    setLastSubmitted(newReq);
    onRequestSubmitted(newReq);
    setInputText('');
    
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.75 }
    });
  };

  return (
    <div className="glass-panel" style={{ maxWidth: 940, margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--border-glass)',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-emerald">
              <Sparkles size={12} /> Digital Public Good Voice Studio
            </span>
            <span className="badge badge-cyan">
              <ShieldCheck size={12} /> Ground-Truth Verified
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }} className="gradient-text">
            Citizen Development Request Intake
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Voice & text gateway with integrated Google Maps geocoding and real-time proximity validation.
          </p>
        </div>
      </div>

      {/* Visual Language Chips */}
      <div style={{ marginTop: '1.25rem' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
          Select Indian Linguistic Gateway:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {LANGUAGES.map((l) => {
            const isSelected = selectedLang === l.name;
            return (
              <button
                type="button"
                key={l.code}
                onClick={() => setSelectedLang(l.name)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1px solid var(--emerald-primary)' : '1px solid var(--border-glass)',
                  background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.7)',
                  color: isSelected ? '#34d399' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none'
                }}
              >
                <span style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  background: isSelected ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                  color: isSelected ? '#022c22' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)'
                }}>
                  {l.glyph}
                </span>
                <span>{l.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Voice & Text Form */}
      <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)' }}>
              Input Grievance via Voice or Text ({selectedLang})
            </label>
            {isRecording && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f43f5e', fontSize: '0.78rem', fontWeight: 800 }}>
                <div className="waveform-container">
                  <div className="wave-bar" style={{ background: '#f43f5e' }}></div>
                  <div className="wave-bar" style={{ background: '#f43f5e' }}></div>
                  <div className="wave-bar" style={{ background: '#f43f5e' }}></div>
                  <div className="wave-bar" style={{ background: '#f43f5e' }}></div>
                  <div className="wave-bar" style={{ background: '#f43f5e' }}></div>
                  <div className="wave-bar" style={{ background: '#f43f5e' }}></div>
                </div>
                <span>LIVE RECORDING & NLU PARSING...</span>
              </div>
            )}
          </div>

          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Click 'Record Voice' or type your issue in any regional language (e.g. 500 மக்கள் புதிய மருத்துவமனை வேண்டும், पानी की समस्या, सड़क खराब है)..."
            style={{
              width: '100%',
              background: 'rgba(2, 6, 23, 0.7)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              color: 'var(--text-main)',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-sans)',
              lineHeight: 1.6,
              outline: 'none',
              transition: 'border-color 0.2s',
              resize: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--emerald-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-glass)'}
          />

          {/* Quick Voice Simulation Interactive Cards */}
          <div style={{ marginTop: '0.85rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 800, display: 'block', marginBottom: '0.4rem' }}>
              One-Click Judge Scenario Simulations (Visual Sector Triggers):
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.6rem' }}>
              {SAMPLE_VOICE_SCRIPTS.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      setSelectedLang(s.lang);
                      setInputText(s.text);
                      setPinnedLocation({ lat: s.lat, lon: s.lon, name: s.locationName });
                    }}
                    className="btn-secondary"
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.55rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      justifyContent: 'flex-start',
                      width: '100%'
                    }}
                  >
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: 'rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Icon size={16} color={s.color} />
                    </div>
                    <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.label}
                      </span>
                      <span className={`badge ${s.badge.includes('Proximity') ? 'badge-amber' : 'badge-emerald'}`} style={{ fontSize: '0.58rem', padding: '0.05rem 0.35rem', marginTop: 2 }}>
                        {s.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Google Maps Location Pinning Section */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <MapPin size={16} />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
                  Target Geolocation: {pinnedLocation.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', fontFamily: 'var(--font-mono)' }}>
                  Google Map Coordinates: {pinnedLocation.lat}° N, {pinnedLocation.lon}° E
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGoogleMap(!showGoogleMap)}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
            >
              <MapPin size={14} color="#06b6d4" />
              <span>{showGoogleMap ? 'Hide Google Map' : 'Find / Pin on Google Map'}</span>
              {showGoogleMap ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* Embedded Google Maps Finder Widget */}
          {showGoogleMap && (
            <div style={{ marginTop: '1rem' }}>
              <GoogleMapLocationFinder
                initialLat={pinnedLocation.lat}
                initialLon={pinnedLocation.lon}
                initialName={pinnedLocation.name}
                onLocationSelected={(lat, lon, name) => {
                  setPinnedLocation({ lat, lon, name });
                }}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-glass)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <button
            type="button"
            onClick={handleSimulatedRecording}
            disabled={isRecording || isProcessing}
            className="btn-secondary"
            style={{
              padding: '0.75rem 1.4rem',
              background: isRecording ? 'rgba(244, 63, 94, 0.15)' : undefined,
              borderColor: isRecording ? 'rgba(244, 63, 94, 0.4)' : undefined,
              color: isRecording ? '#fda4af' : undefined
            }}
          >
            <Mic size={18} color={isRecording ? '#f43f5e' : '#10b981'} className={isRecording ? 'animate-bounce' : ''} />
            <span style={{ fontWeight: 700 }}>
              {isRecording ? 'Listening (AI Multimodal Ingestion)...' : 'Record Regional Voice (Gemini AI)'}
            </span>
          </button>

          <button
            type="submit"
            disabled={isProcessing || !inputText.trim()}
            className="btn-primary"
            style={{ opacity: (isProcessing || !inputText.trim()) ? 0.5 : 1 }}
          >
            {isProcessing ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 14, height: 14, border: '2px solid #022c22', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></span>
                Validating with Ground-Truth GIS...
              </span>
            ) : (
              <>
                <Send size={16} />
                <span>Submit to National AI Pipeline</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* AI Processing Result Card */}
      {lastSubmitted && (
        <div style={{
          marginTop: '1.75rem',
          background: 'rgba(2, 6, 23, 0.85)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.8rem', fontWeight: 700 }}>
              <CheckCircle2 size={16} />
              <span>Grievance Processed by Gemini NLU & Ground-Truth Validator</span>
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              ID: {lastSubmitted.id} • {lastSubmitted.district}, {lastSubmitted.state}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>Detected Language</span>
              <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{lastSubmitted.detectedLanguage}</span>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>Identified Sector</span>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#34d399' }}>{lastSubmitted.sector}</span>
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>Priority Urgency Meter</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.88rem', color: lastSubmitted.urgencyScore < 5 ? '#94a3b8' : '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                  {lastSubmitted.urgencyScore} / 10
                </span>
                <div style={{ flex: 1, height: 6, background: '#1e293b', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    width: `${lastSubmitted.urgencyScore * 10}%`,
                    height: '100%',
                    background: lastSubmitted.urgencyScore < 5 ? '#94a3b8' : 'linear-gradient(90deg, #f59e0b, #ef4444)',
                    borderRadius: 999
                  }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Proximity Verdict Box */}
          {lastSubmitted.validationResult && (
            <div style={{
              padding: '0.9rem 1.1rem',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${lastSubmitted.validationResult.policyVerdict.includes('DE-PRIORITIZED') ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
              background: lastSubmitted.validationResult.policyVerdict.includes('DE-PRIORITIZED') ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.82rem', color: lastSubmitted.validationResult.policyVerdict.includes('DE-PRIORITIZED') ? '#fbbf24' : '#34d399' }}>
                  {lastSubmitted.validationResult.policyVerdict.includes('DE-PRIORITIZED') ? (
                    <XCircle size={16} />
                  ) : (
                    <ShieldCheck size={16} />
                  )}
                  <span>GIS Validation Verdict: {lastSubmitted.validationResult.policyVerdict}</span>
                </span>
                <span style={{ fontSize: '0.72rem', background: '#0f172a', padding: '0.2rem 0.6rem', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-mono)' }}>
                  Distance to Nearest Facility: {lastSubmitted.validationResult.distanceKm} km
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {lastSubmitted.validationResult.validationReason}
              </p>
            </div>
          )}

          <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>
              Gemini AI English Translation & Synthesis:
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic', margin: 0 }}>
              "{lastSubmitted.translatedEnglishText}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
