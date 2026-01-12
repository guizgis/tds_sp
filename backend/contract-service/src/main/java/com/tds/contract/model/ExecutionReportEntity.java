package com.tds.contract.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "execution_reports")
public class ExecutionReportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String contractId;
    private String executedStrategyId;
    
    @ElementCollection
    private List<String> executedActions;
    
    private String executionResult;
    
    @Column(columnDefinition = "TEXT")
    private String executionDetails;
    
    private LocalDateTime reportTime;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContractId() { return contractId; }
    public void setContractId(String contractId) { this.contractId = contractId; }
    public String getExecutedStrategyId() { return executedStrategyId; }
    public void setExecutedStrategyId(String executedStrategyId) { this.executedStrategyId = executedStrategyId; }
    public List<String> getExecutedActions() { return executedActions; }
    public void setExecutedActions(List<String> executedActions) { this.executedActions = executedActions; }
    public String getExecutionResult() { return executionResult; }
    public void setExecutionResult(String executionResult) { this.executionResult = executionResult; }
    public String getExecutionDetails() { return executionDetails; }
    public void setExecutionDetails(String executionDetails) { this.executionDetails = executionDetails; }
    public LocalDateTime getReportTime() { return reportTime; }
    public void setReportTime(LocalDateTime reportTime) { this.reportTime = reportTime; }
}