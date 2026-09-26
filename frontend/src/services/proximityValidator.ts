import type { ExistingFacility, ValidationCheckResult } from '../types/civic';

// National Geo-registry of active public assets (Bhuvan Open GIS / PM Gati Shakti National Master Plan)
export const NATIONAL_ACTIVE_ASSETS: ExistingFacility[] = [
  {
    id: 'FAC-MED-01',
    name: 'District Civil Hospital Vellore',
    type: 'HOSPITAL',
    latitude: 12.9246,
    longitude: 79.1350,
    operationalStatus: 'FULLY_FUNCTIONAL',
    capacityUtilizationPct: 58,
  },
  {
    id: 'FAC-MED-02',
    name: 'Katpadi Community Health Centre',
    type: 'HOSPITAL',
    latitude: 12.9750,
    longitude: 79.1410,
    operationalStatus: 'FULLY_FUNCTIONAL',
    capacityUtilizationPct: 62,
  },
  {
    id: 'FAC-WTR-01',
    name: 'Ken River Deep Water Pumping Station',
    type: 'WATER_PLANT',
    latitude: 25.4200,
    longitude: 80.2900,
    operationalStatus: 'UNDER_MAINTENANCE',
    capacityUtilizationPct: 92,
  },
  {
    id: 'FAC-SCH-01',
    name: 'Anantapur Model High School & Broadband Hub',
    type: 'SCHOOL',
    latitude: 14.6819,
    longitude: 77.6006,
    operationalStatus: 'FULLY_FUNCTIONAL',
    capacityUtilizationPct: 45,
  }
];

// Haversine formula to compute accurate distance in kilometers
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Real-time Ground Truth Proximity Validator:
 * Audits citizen demand against nearby registered public assets to prevent duplicate spending.
 */
export function validateAgainstGroundTruth(
  requestLat: number,
  requestLon: number,
  sector: string,
  rawDemandScore: number
): ValidationCheckResult {
  // Map sector to facility type
  const targetType = sector === 'HEALTHCARE' ? 'HOSPITAL' 
    : sector === 'WATER' ? 'WATER_PLANT' 
    : sector === 'EDUCATION' ? 'SCHOOL' 
    : 'HOSPITAL';

  const matchingFacilities = NATIONAL_ACTIVE_ASSETS.filter(f => f.type === targetType);

  if (matchingFacilities.length === 0) {
    return {
      hasNearbyFacility: false,
      distanceKm: 999,
      originalDemandScore: rawDemandScore,
      adjustedPriorityScore: rawDemandScore,
      discountFactor: 1.0,
      policyVerdict: 'CONFIRMED HIGH PRIORITY',
      validationReason: 'No existing public facility detected within 25km radius. Greenfield infrastructure needed.',
    };
  }

  // Find closest facility
  let closest = matchingFacilities[0];
  let minDistance = calculateHaversineDistance(requestLat, requestLon, closest.latitude, closest.longitude);

  for (const fac of matchingFacilities) {
    const d = calculateHaversineDistance(requestLat, requestLon, fac.latitude, fac.longitude);
    if (d < minDistance) {
      minDistance = d;
      closest = fac;
    }
  }

  // Proximity Rules:
  // If a fully functional facility exists within <= 3.5 km:
  if (minDistance <= 3.5 && closest.operationalStatus === 'FULLY_FUNCTIONAL') {
    const discount = 0.35; // 65% reduction in priority
    const adjusted = Math.round(rawDemandScore * discount * 10) / 10;
    return {
      hasNearbyFacility: true,
      nearestFacilityName: closest.name,
      distanceKm: minDistance,
      facilityStatus: closest.operationalStatus,
      facilityUtilization: closest.capacityUtilizationPct,
      originalDemandScore: rawDemandScore,
      adjustedPriorityScore: adjusted,
      discountFactor: discount,
      policyVerdict: 'DE-PRIORITIZED (EXISTING ASSET AVAILABLE)',
      validationReason: `Verified functional asset "${closest.name}" located only ${minDistance}km away with ${100 - closest.capacityUtilizationPct}% spare capacity. De-prioritizing new greenfield construction to prevent duplicative public capex.`,
    };
  }

  // If facility is between 3.5km and 8.0km:
  if (minDistance <= 8.0) {
    const discount = 0.70;
    const adjusted = Math.round(rawDemandScore * discount * 10) / 10;
    return {
      hasNearbyFacility: true,
      nearestFacilityName: closest.name,
      distanceKm: minDistance,
      facilityStatus: closest.operationalStatus,
      facilityUtilization: closest.capacityUtilizationPct,
      originalDemandScore: rawDemandScore,
      adjustedPriorityScore: adjusted,
      discountFactor: discount,
      policyVerdict: 'EQUIPMENT/CAPACITY UPGRADE ONLY',
      validationReason: `Nearest asset "${closest.name}" is ${minDistance}km away. Recommend last-mile feeder transit or upgrading existing facility rather than constructing an entirely new unit.`,
    };
  }

  // Distance > 8km or facility under maintenance / non-functional:
  return {
    hasNearbyFacility: false,
    nearestFacilityName: closest.name,
    distanceKm: minDistance,
    facilityStatus: closest.operationalStatus,
    facilityUtilization: closest.capacityUtilizationPct,
    originalDemandScore: rawDemandScore,
    adjustedPriorityScore: rawDemandScore,
    discountFactor: 1.0,
    policyVerdict: 'CONFIRMED HIGH PRIORITY',
    validationReason: `Nearest asset is ${minDistance}km away (exceeds national accessibility threshold). Genuine infrastructure deficit confirmed.`,
  };
}
