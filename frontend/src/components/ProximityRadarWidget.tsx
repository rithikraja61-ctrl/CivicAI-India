import React from 'react';
import type { ValidationCheckResult } from '../types/civic';
import { XCircle, CheckCircle2, Building2 } from 'lucide-react';

interface ProximityRadarWidgetProps {
  validation: ValidationCheckResult;
  district: string;
  sector: string;
}

export const ProximityRadarWidget: React.FC<ProximityRadarWidgetProps> = ({
  validation,
  district,
  sector
}) => {
  const isDePrioritized = validation.policyVerdict.includes('DE-PRIORITIZED');
  const distanceKm = validation.distanceKm || 2.1;
  // Calculate relative SVG position based on distance (clamp 0 to 10km)
  const normalizedDistance = Math.min(Math.max(distanceKm / 10, 0.15), 0.85);
  const targetX = 120 + Math.cos(Math.PI / 4) * (normalizedDistance * 95);
  const targetY = 120 - Math.sin(Math.PI / 4) * (normalizedDistance * 95);

  return (
    <div style={{
      background: 'rgba(2, 6, 23, 0.9)',
      border: `1px solid ${isDePrioritized ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
      borderRadius: 'var(--radius-md)',
      padding: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      flexWrap: 'wrap',
      boxShadow: isDePrioritized ? '0 10px 30px -10px rgba(245, 158, 11, 0.2)' : '0 10px 30px -10px rgba(16, 185, 129, 0.2)'
    }}>
      {/* Visual Interactive SVG Radar */}
      <div style={{ position: 'relative', width: 240, height: 240, flexShrink: 0, margin: '0 auto' }}>
        <svg width="240" height="240" viewBox="0 0 240 240" style={{ overflow: 'visible' }}>
          {/* Background circle */}
          <circle cx="120" cy="120" r="105" fill="#070c18" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
          
          {/* Outer Ring: 8.0 km threshold */}
          <circle cx="120" cy="120" r="85" fill="none" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
          <text x="125" y="42" fill="#6366f1" fontSize="8" fontFamily="var(--font-mono)">8.0 KM (UPGRADE ZONE)</text>

          {/* Inner Ring: 3.5 km threshold (Duplicative Capex Zone) */}
          <circle cx="120" cy="120" r="45" fill={isDePrioritized ? "rgba(245, 158, 11, 0.08)" : "rgba(16, 185, 129, 0.05)"} stroke={isDePrioritized ? "rgba(245, 158, 11, 0.4)" : "rgba(16, 185, 129, 0.3)"} strokeWidth="1.5" />
          <text x="125" y="80" fill={isDePrioritized ? "#f59e0b" : "#10b981"} fontSize="8" fontFamily="var(--font-mono)">3.5 KM (PROXIMITY LIMIT)</text>

          {/* Crosshairs */}
          <line x1="120" y1="15" x2="120" y2="225" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
          <line x1="15" y1="120" x2="225" y2="120" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />

          {/* Radar Sweep Animation Line */}
          <g className="radar-sweep">
            <line x1="120" y1="120" x2="225" y2="120" stroke="url(#radarGradient)" strokeWidth="2" />
          </g>

          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Center Citizen Grievance Location */}
          <circle cx="120" cy="120" r="6" fill="#38bdf8" />
          <circle cx="120" cy="120" r="14" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.6">
            <animate attributeName="r" values="6;22" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x="120" y="142" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">CITIZEN DEMAND</text>

          {/* Detected Ground Truth Facility Target */}
          {validation.hasNearbyFacility && (
            <g>
              {/* Distance Connecting Line */}
              <line x1="120" y1="120" x2={targetX} y2={targetY} stroke={isDePrioritized ? "#f59e0b" : "#10b981"} strokeWidth="1.5" strokeDasharray="2 2" />
              <circle cx={targetX} cy={targetY} r="7" fill={isDePrioritized ? "#f59e0b" : "#10b981"} />
              <circle cx={targetX} cy={targetY} r="16" fill="none" stroke={isDePrioritized ? "#f59e0b" : "#10b981"} strokeWidth="1">
                <animate attributeName="r" values="7;24" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <text x={targetX} y={targetY - 12} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                {distanceKm} KM
              </text>
            </g>
          )}
        </svg>

        <div style={{
          position: 'absolute',
          bottom: 2,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: '0.65rem',
          color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)'
        }}>
          RADAR • {district.toUpperCase()} ({sector})
        </div>
      </div>

      {/* Right Column: Visual Metrics & Proximity Audit Verdict */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Verdict Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span className={`badge ${isDePrioritized ? 'badge-amber' : 'badge-emerald'}`} style={{ fontSize: '0.72rem', padding: '0.3rem 0.8rem' }}>
            {isDePrioritized ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
            {validation.policyVerdict}
          </span>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
            STATUS: {validation.facilityStatus || 'ACTIVE'} ({100 - (validation.facilityUtilization || 58)}% VACANT)
          </span>
        </div>

        {/* Visual Score Comparison Bar */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
              Algorithmic Proximity Discounting
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', color: isDePrioritized ? '#fbbf24' : '#34d399', fontWeight: 800 }}>
              {isDePrioritized ? '-65% Capex Penalty' : '0% Greenfield Need'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block' }}>Raw Demand</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>
                {validation.originalDemandScore}
              </span>
            </div>

            <div style={{ flex: 1, position: 'relative', height: 8, background: '#1e293b', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${validation.originalDemandScore}%`,
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 999
              }}></div>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${validation.adjustedPriorityScore}%`,
                background: isDePrioritized ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, #10b981, #06b6d4)',
                borderRadius: 999,
                transition: 'width 0.8s ease'
              }}></div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block' }}>Adjusted Score</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: isDePrioritized ? '#fbbf24' : '#34d399', fontFamily: 'var(--font-mono)' }}>
                {validation.adjustedPriorityScore}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Capex Impact Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isDePrioritized ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          border: `1px solid ${isDePrioritized ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
          borderRadius: 'var(--radius-sm)',
          padding: '0.65rem 1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={16} color={isDePrioritized ? '#fbbf24' : '#34d399'} />
            <span style={{ fontSize: '0.78rem', color: '#f8fafc', fontWeight: 600 }}>
              {validation.nearestFacilityName || 'Nearest Facility'} ({distanceKm} km away)
            </span>
          </div>

          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: isDePrioritized ? '#fbbf24' : '#34d399',
            fontFamily: 'var(--font-mono)'
          }}>
            {isDePrioritized ? 'SAVED ₹22 CRORE CAPEX' : 'GENUINE DEFICIT APPROVED'}
          </span>
        </div>
      </div>
    </div>
  );
};
