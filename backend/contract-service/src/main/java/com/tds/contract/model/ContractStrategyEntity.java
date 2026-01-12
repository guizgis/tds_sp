package com.tds.contract.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "contract_strategies")
public class ContractStrategyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String dataProductId;
    private String dataProductName;

    private String providerNodeId;
    private String providerNodeName;
    private String consumerNodeId;
    private String consumerNodeName;

    @ElementCollection
    @CollectionTable(name = "strategy_actions", joinColumns = @JoinColumn(name = "strategy_id"))
    @Column(name = "action")
    private List<String> actions = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "strategy_id")
    private List<ConstraintEntity> constraints = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String policyExpansion;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDataProductId() { return dataProductId; }
    public void setDataProductId(String dataProductId) { this.dataProductId = dataProductId; }
    public String getDataProductName() { return dataProductName; }
    public void setDataProductName(String dataProductName) { this.dataProductName = dataProductName; }
    public String getProviderNodeId() { return providerNodeId; }
    public void setProviderNodeId(String providerNodeId) { this.providerNodeId = providerNodeId; }
    public String getProviderNodeName() { return providerNodeName; }
    public void setProviderNodeName(String providerNodeName) { this.providerNodeName = providerNodeName; }
    public String getConsumerNodeId() { return consumerNodeId; }
    public void setConsumerNodeId(String consumerNodeId) { this.consumerNodeId = consumerNodeId; }
    public String getConsumerNodeName() { return consumerNodeName; }
    public void setConsumerNodeName(String consumerNodeName) { this.consumerNodeName = consumerNodeName; }
    public List<String> getActions() { return actions; }
    public void setActions(List<String> actions) { this.actions = actions; }
    public List<ConstraintEntity> getConstraints() { return constraints; }
    public void setConstraints(List<ConstraintEntity> constraints) { this.constraints = constraints; }
    public String getPolicyExpansion() { return policyExpansion; }
    public void setPolicyExpansion(String policyExpansion) { this.policyExpansion = policyExpansion; }
}