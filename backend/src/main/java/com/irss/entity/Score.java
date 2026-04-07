package com.irss.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "scores")
public class Score {

    @Id
    private String id;

    private String userId;

    private Float cgpa;
    private String technicalSkills;
    private String nonTechnicalSkills;
    private Integer internships;
    private String certificationsList;
    private String projectsList;
    private Integer totalScore;
    private String status;

    public Score() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Float getCgpa() { return cgpa; }
    public void setCgpa(Float cgpa) { this.cgpa = cgpa; }

    public String getTechnicalSkills() { return technicalSkills; }
    public void setTechnicalSkills(String technicalSkills) { this.technicalSkills = technicalSkills; }

    public String getNonTechnicalSkills() { return nonTechnicalSkills; }
    public void setNonTechnicalSkills(String nonTechnicalSkills) { this.nonTechnicalSkills = nonTechnicalSkills; }

    public Integer getInternships() { return internships; }
    public void setInternships(Integer internships) { this.internships = internships; }

    public String getCertificationsList() { return certificationsList; }
    public void setCertificationsList(String certificationsList) { this.certificationsList = certificationsList; }

    public String getProjectsList() { return projectsList; }
    public void setProjectsList(String projectsList) { this.projectsList = projectsList; }

    public Integer getTotalScore() { return totalScore; }
    public void setTotalScore(Integer totalScore) { this.totalScore = totalScore; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
