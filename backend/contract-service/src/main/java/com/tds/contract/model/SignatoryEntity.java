package com.tds.contract.model;

import jakarta.persistence.Embeddable;
import java.time.LocalDateTime;

@Embeddable
public class SignatoryEntity {
    private String entityId;
    private String entityName;
    private String signatoryType; // 01, 02, 03, 04
    private String signature;
    private LocalDateTime signTime;

    // Getters and Setters
    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }
    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }
    public String getSignatoryType() { return signatoryType; }
    public void setSignatoryType(String signatoryType) { this.signatoryType = signatoryType; }
    public String getSignature() { return signature; }
    public void setSignature(String signature) { this.signature = signature; }
    public LocalDateTime getSignTime() { return signTime; }
    public void setSignTime(LocalDateTime signTime) { this.signTime = signTime; }
}