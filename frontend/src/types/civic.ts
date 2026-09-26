export interface ExistingFacility {
  id: string;
  name: string;
  type: 'HOSPITAL' | 'WATER_PLANT' | 'SCHOOL' | 'ROAD_TRANSIT';
  latitude: number;
  longitude: number;
  operationalStatus: 'FULLY_FUNCTIONAL' | 'OVERBURDENED' | 'UNDER_MAINTENANCE';
  capacityUtilizationPct: number; // e.g., 65% capacity
}

export interface ValidationCheckResult {
  hasNearbyFacility: boolean;
  nearestFacilityName?: string;
  distanceKm: number;
  facilityStatus?: string;
  facilityUtilization?: number;
  originalDemandScore: number;
  adjustedPriorityScore: number;
  discountFactor: number; // e.g., 0.35 multiplier if facility is only 2km away
  policyVerdict: 'DE-PRIORITIZED (EXISTING ASSET AVAILABLE)' | 'CONFIRMED HIGH PRIORITY' | 'EQUIPMENT/CAPACITY UPGRADE ONLY';
  validationReason: string;
}

export interface CitizenRequest {
  id: string;
  rawInputText: string;
  inputType: 'VOICE' | 'TEXT' | 'MESSAGING';
  detectedLanguage: string;
  translatedEnglishText: string;
  sector: 'WATER' | 'ROADS' | 'HEALTHCARE' | 'EDUCATION' | 'ELECTRICITY' | 'SANITATION';
  state: string;
  district: string;
  subDistrict?: string;
  latitude: number;
  longitude: number;
  urgencyScore: number;
  summary: string;
  status: string;
  timestamp?: string;
  validationResult?: ValidationCheckResult;
}

export interface DemandHotspot {
  id: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  primarySector: string;
  requestCount: number;
  compositePriorityScore: number;
  infrastructureDeficitIndex: number;
  affectedPopulation: number;
  primaryIssueSummary: string;
  languageBreakdown: string[];
  status: 'HIGH_DEMAND_CRITICAL' | 'MODERATE_DEMAND' | 'STABLE';
  realTimeValidation?: ValidationCheckResult;
}

export interface InfraProjectRecommendation {
  id: string;
  projectTitle: string;
  targetDistrict: string;
  state: string;
  sector: string;
  estimatedBudgetINR: string;
  priorityRank: number;
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  executiveSummary: string;
  alignmentWithPMGS: string;
  projectedBeneficiaries: number;
  citizenDemandEvidence: string[];
  dpiIntegrationTag: string;
  status: string;
  gisProximityAudit: string;
}
