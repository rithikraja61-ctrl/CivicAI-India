package com.civicai.service;

import com.civicai.model.CitizenRequest;
import com.civicai.model.DemandHotspot;
import com.civicai.model.InfraProjectRecommendation;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class CivicDataService {

    private final List<CitizenRequest> requests = Collections.synchronizedList(new ArrayList<>());
    private final List<DemandHotspot> hotspots = Collections.synchronizedList(new ArrayList<>());
    private final List<InfraProjectRecommendation> recommendations = Collections.synchronizedList(new ArrayList<>());

    public CivicDataService() {
        seedInitialData();
    }

    private void seedInitialData() {
        // Seed Realistic Citizen Demands across Indian States & Languages
        requests.add(CitizenRequest.builder()
                .id("REQ-1001")
                .rawInputText("हमारे गांव बुंदेलखंड में पानी की बहुत किल्लत है। नल से जल योजना का पाइप अधूरा पड़ा है।")
                .inputType("VOICE")
                .detectedLanguage("Hindi")
                .translatedEnglishText("Severe water shortage in Bundelkhand village. Nal se Jal pipeline work left incomplete.")
                .sector("WATER")
                .state("Uttar Pradesh")
                .district("Banda")
                .subDistrict("Tindwari")
                .latitude(25.4764)
                .longitude(80.3344)
                .urgencyScore(9)
                .summary("Incomplete water pipeline causing acute drinking water crisis across 4 panchayats.")
                .status("ANALYZED")
                .timestamp(LocalDateTime.now().minusHours(4))
                .build());

        requests.add(CitizenRequest.builder()
                .id("REQ-1002")
                .rawInputText("வேலூர் கிராமத்தில் ஆரம்ப சுகாதார நிலையத்தில் இரவு நேரத்தில் மருத்துவர் இல்லை.")
                .inputType("VOICE")
                .detectedLanguage("Tamil")
                .translatedEnglishText("Primary Health Centre in Vellore rural has no doctor during night shifts.")
                .sector("HEALTHCARE")
                .state("Tamil Nadu")
                .district("Vellore")
                .subDistrict("Katpadi")
                .latitude(12.9165)
                .longitude(79.1325)
                .urgencyScore(8)
                .summary("Lack of emergency medical staff & diagnostic tools at night in rural PHC.")
                .status("ANALYZED")
                .timestamp(LocalDateTime.now().minusHours(8))
                .build());

        requests.add(CitizenRequest.builder()
                .id("REQ-1003")
                .rawInputText("మా గ్రామంలో పాఠశాల డిజిటల్ కనెక్టివిటీ మరియు విద్యుత్ సౌకర్యం లేదు.")
                .inputType("TEXT")
                .detectedLanguage("Telugu")
                .translatedEnglishText("School in our village lacks digital connectivity and stable electricity.")
                .sector("EDUCATION")
                .state("Andhra Pradesh")
                .district("Anantapur")
                .subDistrict("Dharmavaram")
                .latitude(14.4137)
                .longitude(77.7126)
                .urgencyScore(7)
                .summary("Digital classrooms unusable due to 8-hour daily power cuts and internet blackout.")
                .status("ANALYZED")
                .timestamp(LocalDateTime.now().minusHours(12))
                .build());

        requests.add(CitizenRequest.builder()
                .id("REQ-1004")
                .rawInputText("उत्तर कन्नड़ जिले में बार-बार सड़क धंसने से संपर्क टूट जाता है।")
                .inputType("TEXT")
                .detectedLanguage("Kannada")
                .translatedEnglishText("Frequent road cave-ins and landslides cut off Connectivity in Uttara Kannada.")
                .sector("ROADS")
                .state("Karnataka")
                .district("Uttara Kannada")
                .subDistrict("Sirsi")
                .latitude(14.6195)
                .longitude(74.8354)
                .urgencyScore(9)
                .summary("Major district road damaged; agricultural transport blocked for 15 villages.")
                .status("ANALYZED")
                .timestamp(LocalDateTime.now().minusHours(24))
                .build());

        // Seed Demand Hotspots
        hotspots.add(DemandHotspot.builder()
                .id("HOT-01")
                .district("Banda")
                .state("Uttar Pradesh")
                .latitude(25.4764)
                .longitude(80.3344)
                .primarySector("WATER")
                .requestCount(1420)
                .compositePriorityScore(91.5)
                .infrastructureDeficitIndex(88.0)
                .affectedPopulation(350000)
                .primaryIssueSummary("Chronic groundwater depletion & unfinished rural pipeline networks.")
                .languageBreakdown(List.of("Hindi (85%)", "Bundeli (15%)"))
                .status("HIGH_DEMAND_CRITICAL")
                .build());

        hotspots.add(DemandHotspot.builder()
                .id("HOT-02")
                .district("Vellore")
                .state("Tamil Nadu")
                .latitude(12.9165)
                .longitude(79.1325)
                .primarySector("HEALTHCARE")
                .requestCount(980)
                .compositePriorityScore(84.2)
                .infrastructureDeficitIndex(76.5)
                .affectedPopulation(210000)
                .primaryIssueSummary("Shortage of emergency trauma units and telemedicine connectivity.")
                .languageBreakdown(List.of("Tamil (90%)", "English (10%)"))
                .status("HIGH_DEMAND_CRITICAL")
                .build());

        hotspots.add(DemandHotspot.builder()
                .id("HOT-03")
                .district("Anantapur")
                .state("Andhra Pradesh")
                .latitude(14.4137)
                .longitude(77.7126)
                .primarySector("EDUCATION")
                .requestCount(750)
                .compositePriorityScore(79.0)
                .infrastructureDeficitIndex(72.0)
                .affectedPopulation(180000)
                .primaryIssueSummary("Solar-powered digital labs required in rural primary schools.")
                .languageBreakdown(List.of("Telugu (95%)"))
                .status("MODERATE_DEMAND")
                .build());

        hotspots.add(DemandHotspot.builder()
                .id("HOT-04")
                .district("Uttara Kannada")
                .state("Karnataka")
                .latitude(14.6195)
                .longitude(74.8354)
                .primarySector("ROADS")
                .requestCount(1150)
                .compositePriorityScore(88.4)
                .infrastructureDeficitIndex(84.0)
                .affectedPopulation(290000)
                .primaryIssueSummary("All-weather slope stabilization & bridge reconstruction on rural corridors.")
                .languageBreakdown(List.of("Kannada (80%)", "Konkani (20%)"))
                .status("HIGH_DEMAND_CRITICAL")
                .build());

        // Seed High-Priority AI Infrastructure Recommendations
        recommendations.add(InfraProjectRecommendation.builder()
                .id("REC-PROJ-01")
                .projectTitle("Bundelkhand Solar Smart Water Grid & Piped Pipeline Completion")
                .targetDistrict("Banda")
                .state("Uttar Pradesh")
                .sector("WATER")
                .estimatedBudgetINR("₹14.2 Crore")
                .priorityRank(1)
                .urgencyLevel("CRITICAL")
                .executiveSummary("Deploy 12 solar-powered water pumping stations and integrate real-time IoT water quality sensors connected to national Jal Jeevan Mission dashboard.")
                .alignmentWithPMGS("PM Gati Shakti Water Infra Overlay #UP-W-882")
                .projectedBeneficiaries(350000)
                .citizenDemandEvidence(List.of(
                        "1,420 localized voice/text reports received across 4 sub-districts.",
                        "Average citizen urgency rating: 9.1/10."
                ))
                .dpiIntegrationTag("Jal Jeevan DPI + Bhuvan GIS")
                .status("PROPOSED")
                .build());

        recommendations.add(InfraProjectRecommendation.builder()
                .id("REC-PROJ-02")
                .projectTitle("Vellore Regional Trauma & Tele-Health Mobile Network")
                .targetDistrict("Vellore")
                .state("Tamil Nadu")
                .sector("HEALTHCARE")
                .estimatedBudgetINR("₹8.6 Crore")
                .priorityRank(2)
                .urgencyLevel("HIGH")
                .executiveSummary("Establish 5 Tele-ICU hubs at rural PHCs powered by e-Sanjeevani DPI and 24/7 solar power backup.")
                .alignmentWithPMGS("National Health Stack & PMSSY Rural Healthcare Corridor")
                .projectedBeneficiaries(210000)
                .citizenDemandEvidence(List.of(
                        "980 citizen grievances logged via Tamil voice hotline.",
                        "Identified 45km radius devoid of night emergency medical care."
                ))
                .dpiIntegrationTag("ABDM Health Stack + e-Sanjeevani")
                .status("PROPOSED")
                .build());
    }

    public List<CitizenRequest> getAllRequests() {
        return new ArrayList<>(requests);
    }

    public CitizenRequest addRequest(CitizenRequest request) {
        if (request.getId() == null) {
            request.setId("REQ-" + (1000 + requests.size() + 1));
        }
        if (request.getTimestamp() == null) {
            request.setTimestamp(LocalDateTime.now());
        }
        requests.add(0, request);
        return request;
    }

    public List<DemandHotspot> getAllHotspots() {
        return new ArrayList<>(hotspots);
    }

    public List<InfraProjectRecommendation> getAllRecommendations() {
        return new ArrayList<>(recommendations);
    }
}
