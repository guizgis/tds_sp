package com.tds.catalog.entity;

import com.tds.catalog.model.*;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "catalogs")
public class CatalogEntity {
    @Id
    private String id;
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String version;
    private String status;
    private String providerId;
    private String targetSpaceId;
    private OffsetDateTime createTime;
    private OffsetDateTime updateTime;
    
    @Column(columnDefinition = "TEXT")
    private String fullDataJson;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }
    public String getTargetSpaceId() { return targetSpaceId; }
    public void setTargetSpaceId(String targetSpaceId) { this.targetSpaceId = targetSpaceId; }
    public OffsetDateTime getCreateTime() { return createTime; }
    public void setCreateTime(OffsetDateTime createTime) { this.createTime = createTime; }
    public OffsetDateTime getUpdateTime() { return updateTime; }
    public void setUpdateTime(OffsetDateTime updateTime) { this.updateTime = updateTime; }
    public String getFullDataJson() { return fullDataJson; }
    public void setFullDataJson(String fullDataJson) { this.fullDataJson = fullDataJson; }
}
