package com.tds.space.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usage_logs")
public class UsageLogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String spaceId;
    private String resourceId;
    private String participantId;
    private String action; // READ, DOWNLOAD, COMPUTE
    private String status; // SUCCESS, VIOLATION
    private String evidenceHash;
    private LocalDateTime timestamp;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSpaceId() { return spaceId; }
    public void setSpaceId(String spaceId) { this.spaceId = spaceId; }
    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }
    public String getParticipantId() { return participantId; }
    public void setParticipantId(String participantId) { this.participantId = participantId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getEvidenceHash() { return evidenceHash; }
    public void setEvidenceHash(String evidenceHash) { this.evidenceHash = evidenceHash; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
