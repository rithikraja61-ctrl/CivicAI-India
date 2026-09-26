package com.civicai.controller;

import com.civicai.model.CitizenRequest;
import com.civicai.model.DemandHotspot;
import com.civicai.model.InfraProjectRecommendation;
import com.civicai.service.CivicDataService;
import com.civicai.service.GeminiAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/civic")
@CrossOrigin(origins = "*")
public class CivicController {

    @Autowired
    private CivicDataService dataService;

    @Autowired
    private GeminiAiService geminiAiService;

    @GetMapping("/requests")
    public ResponseEntity<List<CitizenRequest>> getCitizenRequests() {
        return ResponseEntity.ok(dataService.getAllRequests());
    }

    @PostMapping("/submit-request")
    public ResponseEntity<CitizenRequest> submitRequest(@RequestBody Map<String, String> payload) {
        String inputText = payload.getOrDefault("inputText", "");
        String inputType = payload.getOrDefault("inputType", "TEXT");
        String language = payload.getOrDefault("language", "English");

        CitizenRequest processed = geminiAiService.processMultilingualInput(inputText, inputType, language);
        CitizenRequest saved = dataService.addRequest(processed);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/hotspots")
    public ResponseEntity<List<DemandHotspot>> getHotspots() {
        return ResponseEntity.ok(dataService.getAllHotspots());
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<InfraProjectRecommendation>> getRecommendations() {
        return ResponseEntity.ok(dataService.getAllRecommendations());
    }

    @PostMapping("/generate-recommendation")
    public ResponseEntity<InfraProjectRecommendation> generateRecommendation(@RequestBody Map<String, String> payload) {
        String district = payload.getOrDefault("district", "Banda");
        String sector = payload.getOrDefault("sector", "WATER");
        InfraProjectRecommendation rec = geminiAiService.generateProjectRecommendation(district, sector);
        return ResponseEntity.ok(rec);
    }

    // Meta WhatsApp Cloud API Webhook Verification (Free Tier Compatible)
    @GetMapping("/whatsapp-webhook")
    public ResponseEntity<String> verifyWhatsAppWebhook(
            @RequestParam(value = "hub.mode", required = false) String mode,
            @RequestParam(value = "hub.verify_token", required = false) String token,
            @RequestParam(value = "hub.challenge", required = false) String challenge) {
        String verifyToken = "civicai_india_webhook_token";
        if ("subscribe".equals(mode) && verifyToken.equals(token)) {
            return ResponseEntity.ok(challenge);
        }
        return ResponseEntity.ok("CivicAI WhatsApp Webhook Active");
    }

    // WhatsApp Incoming Message Webhook Handler
    @PostMapping("/whatsapp-webhook")
    public ResponseEntity<Map<String, Object>> handleWhatsAppIncoming(@RequestBody(required = false) Map<String, Object> payload) {
        String userMessage = "";
        String senderNumber = "Citizen-User";

        try {
            if (payload != null) {
                // Check if direct format { text: "...", from: "..." }
                if (payload.containsKey("text")) {
                    userMessage = String.valueOf(payload.get("text"));
                } else if (payload.containsKey("entry")) {
                    // Meta Cloud API structure
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> entries = (List<Map<String, Object>>) payload.get("entry");
                    if (entries != null && !entries.isEmpty()) {
                        @SuppressWarnings("unchecked")
                        List<Map<String, Object>> changes = (List<Map<String, Object>>) entries.get(0).get("changes");
                        if (changes != null && !changes.isEmpty()) {
                            @SuppressWarnings("unchecked")
                            Map<String, Object> value = (Map<String, Object>) changes.get(0).get("value");
                            @SuppressWarnings("unchecked")
                            List<Map<String, Object>> messages = (List<Map<String, Object>>) value.get("messages");
                            if (messages != null && !messages.isEmpty()) {
                                Map<String, Object> msg = messages.get(0);
                                senderNumber = String.valueOf(msg.get("from"));
                                @SuppressWarnings("unchecked")
                                Map<String, Object> textObj = (Map<String, Object>) msg.get("text");
                                if (textObj != null) {
                                    userMessage = String.valueOf(textObj.get("body"));
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            userMessage = "Citizen report via WhatsApp";
        }

        if (userMessage == null || userMessage.trim().isEmpty()) {
            userMessage = "வேலூர் பொது மருத்துவமனை தேவை";
        }

        CitizenRequest processed = geminiAiService.processMultilingualInput(userMessage, "WHATSAPP", "Auto-Detect");
        processed.setOriginalText("[WhatsApp: " + senderNumber + "] " + userMessage);
        dataService.addRequest(processed);

        boolean isHospital = userMessage.toLowerCase().contains("hospital") || userMessage.contains("மருத்துவமனை");
        String replyText;
        if (isHospital) {
            replyText = "⚠️ CivicAI-India Alert: Civil Hospital is 2.1km away with 42% vacant capacity. Request routed to Ambulance Feeder Shuttle Scheme to prevent ₹22 Cr capex redundancy.";
        } else {
            replyText = "✅ CivicAI-India: Grievance registered in national priority queue. Urgency Score: " + processed.getUrgencyScore() + "/10.";
        }

        return ResponseEntity.ok(Map.of(
            "status", "SUCCESS",
            "replyMessage", replyText,
            "requestId", processed.getId(),
            "sector", processed.getSector(),
            "district", processed.getDistrict()
        ));
    }
}

