package com.civicai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InfraProjectRecommendation {
    private String id;
    private String projectTitle;
    private String targetDistrict;
    private String state;
    private String sector;
    private String estimatedBudgetINR; // e.g. "₹4.5 Crore"
    private int priorityRank;
    private String urgencyLevel; // CRITICAL, HIGH, MEDIUM
    private String executiveSummary;
    private String alignmentWithPMGS; // PM Gati Shakti alignment notes
    private long projectedBeneficiaries;
    private List<String> citizenDemandEvidence;
    private String dpiIntegrationTag; // Digital Public Infrastructure tag, e.g., "Aadhaar / ONDU / Bhuvan GIS"
    private String status; // PROPOSED, APPROVED_FOR_PILOT, IN_BUDGET
}
