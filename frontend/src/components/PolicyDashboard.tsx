import React, { useState } from 'react';
import type { DemandHotspot, InfraProjectRecommendation } from '../types/civic';
import { ProximityRadarWidget } from './ProximityRadarWidget';
import { GoogleMapLocationFinder } from './GoogleMapLocationFinder';
import { 
  MapPin, 
  AlertTriangle, 
  Users, 
  Cpu, 
  DollarSign, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Building2,
  Droplets,
  HeartPulse,
  Route,
  GraduationCap,
  Layers,
  TrendingUp,
  Globe
} from 'lucide-react';

interface PolicyDashboardProps {
  hotspots: DemandHotspot[];
  recommendations: InfraProjectRecommendation[];
  onGenerateAIRecommendation: (district: string, sector: string) => void;
}

const SECTOR_CARDS = [
  { id: 'ALL', name: 'All Sectors', count: '4,300+', icon: Layers, color: '#38bdf8' },
  { id: 'WATER', name: 'Clean Water Grid', count: '1,420', icon: Droplets, color: '#06b6d4' },
  { id: 'HEALTHCARE', name: 'Rural Healthcare', count: '980', icon: HeartPulse, color: '#f43f5e' },
  { id: 'ROADS', name: 'Transit Corridors', count: '1,150', icon: Route, color: '#10b981' },
  { id: 'EDUCATION', name: 'Digital Schools', count: '750', icon: GraduationCap, color: '#f59e0b' },
];

export const PolicyDashboard: React.FC<PolicyDashboardProps> = ({
  hotspots,
  recommendations,
  onGenerateAIRecommendation,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<DemandHotspot | null>(hotspots[0] || null);
  const [activeSectorFilter, setActiveSectorFilter] = useState<string>('ALL');
  const [gisViewMode, setGisViewMode] = useState<'RADAR' | 'GOOGLE_MAP'>('RADAR');

  const filteredHotspots = activeSectorFilter === 'ALL'
    ? hotspots
    : hotspots.filter(h => h.primarySector === activeSectorFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner with Capex Saved Visual Ticker */}
      <div className="glass-panel" style={{
        padding: '1.25rem 1.75rem',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.45) 100%)',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(16, 185, 129, 0.2) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#a5b4fc',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.25)'
          }}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Real-Time GIS Ground-Truth Proximity Validator Active
              </h3>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                Capex Waste Prevention
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              Bhuvan Open GIS cross-reference automatically discounts duplicate projects when active public facilities operate within 3.5km.
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          background: 'rgba(2, 6, 23, 0.7)',
          padding: '0.65rem 1.4rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-glass)'
        }}>
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>
              Capex Protected
            </span>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              ₹22+ Crore
            </span>
          </div>
          <div style={{ width: 1, height: 32, background: 'var(--border-glass)' }}></div>
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>
              Redundant Facility De-Prioritized
            </span>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
              1 Hospital
            </span>
          </div>
        </div>
      </div>

      {/* Visual Interactive Sector Selector Cards (Linear / Vercel pattern) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)' }}>
            Filter by Infrastructure Sector
          </span>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            Showing {filteredHotspots.length} Priority Hotspots
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '0.75rem'
        }}>
          {SECTOR_CARDS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSectorFilter === sec.id;
            return (
              <div
                key={sec.id}
                onClick={() => setActiveSectorFilter(sec.id)}
                className={`sector-visual-card ${isActive ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div className="sector-icon-box">
                    <Icon size={20} color={isActive ? '#022c22' : sec.color} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isActive ? '#34d399' : 'var(--text-muted)' }}>
                    {sec.count}
                  </span>
                </div>
                <div style={{ width: '100%', textAlign: 'left', marginTop: '0.2rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isActive ? '#ffffff' : 'var(--text-main)', display: 'block' }}>
                    {sec.name}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                    {isActive ? '● Filtering active' : 'Click to inspect'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem'
      }}>
        {/* Card 1 */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              Total Citizen Voice Demand
            </span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              4,300+
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem', fontSize: '0.75rem', color: '#34d399' }}>
              <TrendingUp size={12} />
              <span>Across 4 Pilot States & 12 Regional Scripts</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              Verified Genuine Deficits
            </span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
              2 Hotspots
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Zero active facilities within 14km radius</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              Proximity De-Prioritized
            </span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc' }}>
              <Building2 size={18} />
            </div>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#a5b4fc', fontFamily: 'var(--font-mono)' }}>
              1 Project
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
              <span>Vellore Hospital (Civil Hospital 2.1km away)</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              AI Recommended Projects
            </span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
              <Cpu size={18} />
            </div>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              {recommendations.length} Active
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Aligned with PM Gati Shakti Overlay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: GIS Interactive Map (Left) & AI Recommendations Feed (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Interactive GIS Map & Proximity Radar */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Map Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} color="#10b981" />
                <span>National Demand Hotspots & Ground Truth Verification</span>
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: '0.15rem 0 0 0' }}>
                Switch between National Radar Overview and Interactive Google Maps GIS with satellite tiles.
              </p>
            </div>

            {/* GIS Mode Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(2, 6, 23, 0.8)', padding: 3, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
              <button
                type="button"
                onClick={() => setGisViewMode('RADAR')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: gisViewMode === 'RADAR' ? '#10b981' : 'transparent',
                  color: gisViewMode === 'RADAR' ? '#022c22' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                📡 Radar Overview
              </button>
              <button
                type="button"
                onClick={() => setGisViewMode('GOOGLE_MAP')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: gisViewMode === 'GOOGLE_MAP' ? '#06b6d4' : 'transparent',
                  color: gisViewMode === 'GOOGLE_MAP' ? '#022c22' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <Globe size={13} />
                <span>Google Maps GIS</span>
              </button>
            </div>
          </div>

          {/* Conditional GIS Map Display */}
          {gisViewMode === 'GOOGLE_MAP' ? (
            <GoogleMapLocationFinder
              key={selectedHotspot?.id || 'default'}
              initialLat={selectedHotspot?.latitude || 12.9165}
              initialLon={selectedHotspot?.longitude || 79.1325}
              initialName={`${selectedHotspot?.district || 'Vellore'}, ${selectedHotspot?.state || 'Tamil Nadu'}`}
              showFacilityBuffer={true}
            />
          ) : (
            <div style={{
              position: 'relative',
              width: '100%',
              height: 380,
              background: 'linear-gradient(180deg, #050811 0%, #0a0f1d 100%)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-glass)',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8)'
            }}>
            {/* Grid Pattern Background */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.15) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              opacity: 0.5
            }}></div>

            {/* Stylized India Regional Geography Guides */}
            <div style={{ position: 'absolute', top: 30, left: 40, fontSize: '0.65rem', color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-mono)' }}>
              NORTHERN CORRIDOR (UP / BUNDELKHAND)
            </div>
            <div style={{ position: 'absolute', bottom: 40, left: 40, fontSize: '0.65rem', color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-mono)' }}>
              SOUTHERN CORRIDOR (TAMIL NADU / KARNATAKA)
            </div>

            {/* Interactive Pins */}
            {filteredHotspots.map((spot) => {
              const isDePrioritized = spot.realTimeValidation?.policyVerdict.includes('DE-PRIORITIZED');
              const isSelected = selectedHotspot?.id === spot.id;

              return (
                <button
                  key={spot.id}
                  onClick={() => setSelectedHotspot(spot)}
                  style={{
                    position: 'absolute',
                    top: `${25 + (spot.latitude - 12) * 20}%`,
                    left: `${20 + (spot.longitude - 74) * 8}%`,
                    transform: 'translate(-50%, -50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: isSelected ? 30 : 10,
                    outline: 'none',
                    transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {!isDePrioritized && (
                      <span style={{
                        position: 'absolute',
                        width: 38,
                        height: 38,
                        borderRadius: '50%',
                        background: spot.compositePriorityScore > 85 ? '#ef4444' : '#10b981',
                        opacity: 0.35,
                        animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                      }}></span>
                    )}
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      color: isDePrioritized ? '#cbd5e1' : '#ffffff',
                      background: isDePrioritized 
                        ? '#334155' 
                        : spot.compositePriorityScore > 85 
                        ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' 
                        : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      border: isSelected ? '2px solid #ffffff' : '1px solid rgba(255,255,255,0.2)',
                      boxShadow: isSelected ? '0 0 20px #10b981' : '0 4px 12px rgba(0,0,0,0.5)',
                      transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                      transition: 'all 0.2s ease'
                    }}>
                      {Math.round(spot.compositePriorityScore)}
                    </div>
                  </div>

                  {/* Pin Tooltip */}
                  <div style={{
                    marginTop: 6,
                    background: 'rgba(2, 6, 23, 0.9)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 6,
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.65rem',
                    color: '#f8fafc',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                  }}>
                    <strong style={{ color: isDePrioritized ? '#94a3b8' : '#34d399' }}>{spot.district}</strong> ({spot.primarySector})
                  </div>
                </button>
              );
            })}

            {/* Map Overlay Badge */}
            <div style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              background: 'rgba(2, 6, 23, 0.85)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.45rem 0.75rem',
              fontSize: '0.68rem',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)'
            }}>
              FORMULA: 0.4×Demand + 0.4×Deficit + 0.2×PopDensity • Discounted by Proximity
            </div>
          </div>
        )}

          {/* Selected Hotspot Deep Dive with Proximity Radar Widget */}
          {selectedHotspot && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                      {selectedHotspot.district} District ({selectedHotspot.state})
                    </h4>
                    {selectedHotspot.realTimeValidation?.policyVerdict.includes('DE-PRIORITIZED') ? (
                      <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                        <XCircle size={12} /> De-Prioritized by Proximity Audit
                      </span>
                    ) : (
                      <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                        <CheckCircle2 size={12} /> Genuine Deficit Verified
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {selectedHotspot.primaryIssueSummary}
                  </p>
                </div>

                <button
                  onClick={() => onGenerateAIRecommendation(selectedHotspot.district, selectedHotspot.primarySector)}
                  className="btn-primary"
                  style={{ fontSize: '0.78rem', padding: '0.6rem 1.2rem' }}
                >
                  <Sparkles size={15} />
                  <span>Synthesize Gemini Recommendation</span>
                </button>
              </div>

              {/* Visual Interactive Proximity Radar Widget */}
              {selectedHotspot.realTimeValidation && (
                <ProximityRadarWidget
                  validation={selectedHotspot.realTimeValidation}
                  district={selectedHotspot.district}
                  sector={selectedHotspot.primarySector}
                />
              )}
            </div>
          )}
        </div>

        {/* Right Column: AI Recommended DPI Projects Feed */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={18} color="#06b6d4" />
              <span>Recommended DPI Projects</span>
            </h3>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
              Gemini Structured Output
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: 680, overflowY: 'auto', paddingRight: '0.25rem' }}>
            {recommendations.map((rec) => (
              <div 
                key={rec.id}
                style={{
                  background: 'rgba(2, 6, 23, 0.85)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  transition: 'border-color 0.2s',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className={`badge ${rec.urgencyLevel === 'CRITICAL' ? 'badge-rose' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>
                    Priority #{rec.priorityRank} • {rec.urgencyLevel}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.2rem', fontFamily: 'var(--font-mono)' }}>
                    <DollarSign size={14} />
                    {rec.estimatedBudgetINR}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, lineHeight: 1.4 }}>
                  {rec.projectTitle}
                </h4>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {rec.executiveSummary}
                </p>

                {/* GIS Proximity Audit Tag */}
                {rec.gisProximityAudit && (
                  <div style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    fontSize: '0.72rem',
                    color: '#c7d2fe'
                  }}>
                    <strong style={{ color: '#a5b4fc', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                      GIS Ground-Truth Check:
                    </strong>
                    {rec.gisProximityAudit}
                  </div>
                )}

                <div style={{
                  paddingTop: '0.65rem',
                  borderTop: '1px solid var(--border-glass)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  fontSize: '0.72rem',
                  color: 'var(--text-dim)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>PM Gati Shakti Linkage:</span>
                    <span style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{rec.alignmentWithPMGS}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Target Beneficiaries:</span>
                    <span style={{ color: '#34d399', fontWeight: 700 }}>{rec.projectedBeneficiaries.toLocaleString()} citizens</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>DPI Tag:</span>
                    <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{rec.dpiIntegrationTag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
