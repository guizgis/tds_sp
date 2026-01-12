package com.tds.connector.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "connectors")
public class ConnectorEntity {
    @Id
    private String identityCode;
    private String connectorName;
    private String connectorJoinType;
    private String enterpriseCode;
    private String identityStatus;
    private LocalDate authTime;
    private String connectorType;
    private String connectorMac;
    
    // Supplemental fields
    private String connectorIpList; // Comma separated
    private String connectorDomainList; // Comma separated
    private String enterpriseName;
    private String supplierName;
    private String supplierCode;
    private String connectorSN;
    private String connectorVersion;

    public String getIdentityCode() { return identityCode; }
    public void setIdentityCode(String identityCode) { this.identityCode = identityCode; }
    public String getConnectorName() { return connectorName; }
    public void setConnectorName(String connectorName) { this.connectorName = connectorName; }
    public String getConnectorJoinType() { return connectorJoinType; }
    public void setConnectorJoinType(String connectorJoinType) { this.connectorJoinType = connectorJoinType; }
    public String getEnterpriseCode() { return enterpriseCode; }
    public void setEnterpriseCode(String enterpriseCode) { this.enterpriseCode = enterpriseCode; }
    public String getIdentityStatus() { return identityStatus; }
    public void setIdentityStatus(String identityStatus) { this.identityStatus = identityStatus; }
    public LocalDate getAuthTime() { return authTime; }
    public void setAuthTime(LocalDate authTime) { this.authTime = authTime; }
    public String getConnectorType() { return connectorType; }
    public void setConnectorType(String connectorType) { this.connectorType = connectorType; }
    public String getConnectorMac() { return connectorMac; }
    public void setConnectorMac(String connectorMac) { this.connectorMac = connectorMac; }
    public String getConnectorIpList() { return connectorIpList; }
    public void setConnectorIpList(String connectorIpList) { this.connectorIpList = connectorIpList; }
    public String getConnectorDomainList() { return connectorDomainList; }
    public void setConnectorDomainList(String connectorDomainList) { this.connectorDomainList = connectorDomainList; }
    public String getEnterpriseName() { return enterpriseName; }
    public void setEnterpriseName(String enterpriseName) { this.enterpriseName = enterpriseName; }
    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }
    public String getSupplierCode() { return supplierCode; }
    public void setSupplierCode(String supplierCode) { this.supplierCode = supplierCode; }
    public String getConnectorSN() { return connectorSN; }
    public void setConnectorSN(String connectorSN) { this.connectorSN = connectorSN; }
    public String getConnectorVersion() { return connectorVersion; }
    public void setConnectorVersion(String connectorVersion) { this.connectorVersion = connectorVersion; }
}
