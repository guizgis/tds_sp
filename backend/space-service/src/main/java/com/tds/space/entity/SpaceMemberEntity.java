package com.tds.space.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "space_members")
public class SpaceMemberEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String spaceId;
    private String participantId;
    private String role;
    private String status; // PENDING, APPROVED, REJECTED

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSpaceId() { return spaceId; }
    public void setSpaceId(String spaceId) { this.spaceId = spaceId; }
    public String getParticipantId() { return participantId; }
    public void setParticipantId(String participantId) { this.participantId = participantId; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}