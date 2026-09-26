package com.civicai.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitizenRequest {
    private String id;
    private String rawInputText;
    private String inputType; // VOICE, TEXT, MESSAGING
    private String detectedLanguage; // Hindi, Tamil, Telugu, English, Marathi, Bengali, Kannada, etc.
    private String translatedEnglishText;
    private String sector; // WATER, ROADS, HEALTHCARE, EDUCATION, ELECTRICITY, SANITATION
    private String state;
    private String district;
    private String subDistrict;
    private double latitude;
    private double longitude;
    private int urgencyScore; // 1 to 10
    private String summary;
    private String status; // SUBMITTED, ANALYZED, INCLUDED_IN_PROPOSAL, RESOLVED
    private LocalDateTime timestamp;
}
