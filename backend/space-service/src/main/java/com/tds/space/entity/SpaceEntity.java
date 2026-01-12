package com.tds.space.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "spaces")
public class SpaceEntity {
    @Id
    private String id;
    private String name;
    private String description;
    private String status;
    
    @Column(length = 1024)
    private String usagePolicies; // Stored as comma-separated or JSON
    
    @Column(length = 2048)
    private String resourceIds; // Stored as comma-separated or JSON
    
    private LocalDateTime createdAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getUsagePolicies() { return usagePolicies; }
    public void setUsagePolicies(String usagePolicies) { this.usagePolicies = usagePolicies; }
    public String getResourceIds() { return resourceIds; }
    public void setResourceIds(String resourceIds) { this.resourceIds = resourceIds; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
