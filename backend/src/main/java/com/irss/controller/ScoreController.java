package com.irss.controller;

import com.irss.entity.Score;
import com.irss.repository.ScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ScoreController {

    @Autowired
    private ScoreRepository scoreRepository;

    private int countCsvItems(String csv) {
        if (csv == null || csv.trim().isEmpty()) return 0;
        String[] items = csv.split(",");
        int count = 0;
        for (String item : items) {
            if (!item.trim().isEmpty()) count++;
        }
        return count;
    }

    @PostMapping("/score")
    public ResponseEntity<Map<String, Object>> calculateScore(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String userId = request.get("userId").toString();
            Float cgpa = Float.parseFloat(request.get("cgpa").toString());
            
            String technicalSkills = (String) request.getOrDefault("technicalSkills", "");
            String nonTechnicalSkills = (String) request.getOrDefault("nonTechnicalSkills", "");
            Integer internships = Integer.parseInt(request.getOrDefault("internships", "0").toString());
            String certificationsList = (String) request.getOrDefault("certificationsList", "");
            String projectsList = (String) request.getOrDefault("projectsList", "");

            if (cgpa < 0 || cgpa > 10) {
                response.put("success", false);
                response.put("message", "CGPA must be between 0 and 10.");
                return ResponseEntity.badRequest().body(response);
            }

            int techCount = countCsvItems(technicalSkills);
            int nonTechCount = countCsvItems(nonTechnicalSkills);
            int certsCount = countCsvItems(certificationsList);
            int projectsCount = countCsvItems(projectsList);

            int cgpaScore = Math.round((Math.min(cgpa, 10.0f) / 10.0f) * 25);
            
            // max 12
            int techScore = Math.min(techCount * 3, 12);
            // max 8
            int nonTechScore = Math.min(nonTechCount * 2, 8);
            // Total skills max = 20
            int skillsScore = techScore + nonTechScore;
            
            // Internships: max 20
            int internshipsScore = Math.min(internships * 4, 20);
            
            // Certs: max 15
            int certScore = Math.min(certsCount * 3, 15);
            
            // Projects: max 20
            int projectsScore = Math.min(projectsCount * 4, 20);

            int totalScore = cgpaScore + skillsScore + internshipsScore + certScore + projectsScore;

            String status;
            if (totalScore >= 80) {
                status = "Industry Ready";
            } else if (totalScore >= 50) {
                status = "Almost Ready";
            } else {
                status = "Needs Improvement";
            }

            Score score = new Score();
            score.setUserId(userId);
            score.setCgpa(cgpa);
            score.setTechnicalSkills(technicalSkills);
            score.setNonTechnicalSkills(nonTechnicalSkills);
            score.setInternships(internships);
            score.setCertificationsList(certificationsList);
            score.setProjectsList(projectsList);
            score.setTotalScore(totalScore);
            score.setStatus(status);

            scoreRepository.save(score);

            response.put("success", true);
            response.put("totalScore", totalScore);
            response.put("status", status);
            response.put("breakdown", Map.of(
                    "cgpaScore", cgpaScore,
                    "skillsScore", skillsScore,
                    "internshipsScore", internshipsScore,
                    "certScore", certScore,
                    "projectsScore", projectsScore
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error processing score: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/scores/{userId}")
    public ResponseEntity<List<Score>> getUserScores(@PathVariable String userId) {
        List<Score> scores = scoreRepository.findByUserIdOrderByIdDesc(userId);
        return ResponseEntity.ok(scores);
    }
}
