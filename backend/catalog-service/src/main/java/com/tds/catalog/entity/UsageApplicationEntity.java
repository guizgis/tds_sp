package com.tds.catalog.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "usage_applications")
public class UsageApplicationEntity {
    @Id
    private String id;
    private String catalogId;
    private String catalogName;
    private String applicantId;
    private String providerId;
    
    @Column(columnDefinition = "TEXT")
    private String reason;
    
    private String status; // PENDING, APPROVED, REJECTED
    private OffsetDateTime submitTime;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCatalogId() { return catalogId; }
    public void setCatalogId(String catalogId) { this.catalogId = catalogId; }
    public String getCatalogName() { return catalogName; }
    public void setCatalogName(String catalogName) { this.catalogName = catalogName; }
    public String getApplicantId() { return applicantId; }
    public void setApplicantId(String applicantId) { this.applicantId = applicantId; }
    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public OffsetDateTime getSubmitTime() { return submitTime; }
    public void setSubmitTime(OffsetDateTime submitTime) { this.submitTime = submitTime; }
}
