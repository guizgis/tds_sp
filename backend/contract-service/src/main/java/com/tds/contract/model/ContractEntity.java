package com.tds.contract.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "contracts")
public class ContractEntity {

    @Id
    @Column(length = 47)
    private String contractId;

    @Column(nullable = false)
    private String contractName;

    @Column(length = 1024)
    private String contractAbstract;

    @Column(length = 4)
    private String contractStatus; // 01:发起, 02:协商, 0301:签署成功, 05:履行中, 06:终止

    private LocalDateTime createTime;
    private LocalDateTime activationTime;
    private LocalDateTime endTime;

    @Column(length = 2)
    private String signMode; // 01:点对点, 02:平台参与

    private String issuerId;
    private String issuerEntityId;

    @Column(columnDefinition = "TEXT")
    private String signature;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "contract_id")
    private List<ContractStrategyEntity> strategies = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "contract_signatories", joinColumns = @JoinColumn(name = "contract_id"))
    private List<SignatoryEntity> signatories = new ArrayList<>();

    // Getters and Setters
    public String getContractId() { return contractId; }
    public void setContractId(String contractId) { this.contractId = contractId; }
    public String getContractName() { return contractName; }
    public void setContractName(String contractName) { this.contractName = contractName; }
    public String getContractAbstract() { return contractAbstract; }
    public void setContractAbstract(String contractAbstract) { this.contractAbstract = contractAbstract; }
    public String getContractStatus() { return contractStatus; }
    public void setContractStatus(String contractStatus) { this.contractStatus = contractStatus; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
    public LocalDateTime getActivationTime() { return activationTime; }
    public void setActivationTime(LocalDateTime activationTime) { this.activationTime = activationTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public String getSignMode() { return signMode; }
    public void setSignMode(String signMode) { this.signMode = signMode; }
    public String getIssuerId() { return issuerId; }
    public void setIssuerId(String issuerId) { this.issuerId = issuerId; }
    public String getIssuerEntityId() { return issuerEntityId; }
    public void setIssuerEntityId(String issuerEntityId) { this.issuerEntityId = issuerEntityId; }
    public String getSignature() { return signature; }
    public void setSignature(String signature) { this.signature = signature; }
    public List<ContractStrategyEntity> getStrategies() { return strategies; }
    public void setStrategies(List<ContractStrategyEntity> strategies) { this.strategies = strategies; }
    public List<SignatoryEntity> getSignatories() { return signatories; }
    public void setSignatories(List<SignatoryEntity> signatories) { this.signatories = signatories; }
}