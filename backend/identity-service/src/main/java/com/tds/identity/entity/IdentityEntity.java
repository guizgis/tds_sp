package com.tds.identity.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "identities")
public class IdentityEntity {
    @Id
    private String identityCode;
    private String type; // Person, Enterprise, Operator
    private String name;
    private String status;
    private OffsetDateTime submitTime;
    
    @Column(columnDefinition = "TEXT")
    private String dataJson;

    public String getIdentityCode() { return identityCode; }
    public void setIdentityCode(String identityCode) { this.identityCode = identityCode; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public OffsetDateTime getSubmitTime() { return submitTime; }
    public void setSubmitTime(OffsetDateTime submitTime) { this.submitTime = submitTime; }
    public String getDataJson() { return dataJson; }
    public void setDataJson(String dataJson) { this.dataJson = dataJson; }
}
