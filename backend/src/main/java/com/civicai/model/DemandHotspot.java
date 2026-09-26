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
public class DemandHotspot {
    private String id;
    private String district;
    private String state;
    private double latitude;
    private double longitude;
    private String primarySector;
    private int requestCount;
    private double compositePriorityScore; // Computed index: (Demand Vol * 0.4) + (Infra Deficit * 0.4) + (Pop Density * 0.2)
    private double infrastructureDeficitIndex; // 0 (Good) to 100 (Critical Deficit)
    private long affectedPopulation;
    private String primaryIssueSummary;
    private List<String> languageBreakdown;
    private String status; // HIGH_DEMAND_CRITICAL, MODERATE_DEMAND, STABLE
}
