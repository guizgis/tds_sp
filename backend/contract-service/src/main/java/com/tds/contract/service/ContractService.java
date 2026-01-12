package com.tds.contract.service;

import com.tds.contract.model.*;
import com.tds.contract.repository.ContractRepository;
import com.tds.contract.repository.ExecutionReportRepository;
import com.tds.contract.util.ContractIdGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ContractService {

    private final ContractRepository contractRepository;
    private final ExecutionReportRepository executionReportRepository;

    public ContractService(ContractRepository contractRepository, ExecutionReportRepository executionReportRepository) {
        this.contractRepository = contractRepository;
        this.executionReportRepository = executionReportRepository;
    }

    @Transactional
    public void reportExecution(String contractId, String strategyId, List<String> actions, 
                                String result, String details, LocalDateTime reportTime) {
        ExecutionReportEntity report = new ExecutionReportEntity();
        report.setContractId(contractId);
        report.setExecutedStrategyId(strategyId);
        report.setExecutedActions(actions);
        report.setExecutionResult(result);
        report.setExecutionDetails(details);
        report.setReportTime(reportTime);
        
        executionReportRepository.save(report);
    }

    @Transactional
    public String createContract(String name, String summary, LocalDateTime activationTime, 
                                LocalDateTime endTime, String signMode, String issuerId, 
                                String issuerEntityId, String signature) {
        
        // 4.6 Signature Verification (Mock)
        if (!verifySignature(issuerId, signature)) {
            throw new RuntimeException("Invalid signature");
        }

        // 生成 47位标准 ID
        String contractId = ContractIdGenerator.generate("3", issuerId, "0000");
        
        ContractEntity entity = new ContractEntity();
        entity.setContractId(contractId);
        entity.setContractName(name);
        entity.setContractAbstract(summary);
        entity.setContractStatus("01"); // 发起
        entity.setCreateTime(LocalDateTime.now());
        entity.setActivationTime(activationTime);
        entity.setEndTime(endTime);
        entity.setSignMode(signMode);
        entity.setIssuerId(issuerId);
        entity.setIssuerEntityId(issuerEntityId);
        entity.setSignature(signature);
        
        contractRepository.save(entity);
        return contractId;
    }

    @Transactional
    public boolean negotiate(String contractId, ContractStrategyEntity strategy) {
        Optional<ContractEntity> optional = contractRepository.findById(contractId);
        if (optional.isEmpty()) return false;
        
        ContractEntity entity = optional.get();
        entity.setContractStatus("02"); // 协商
        
        // 简单处理：更新或添加策略
        entity.getStrategies().add(strategy);
        
        contractRepository.save(entity);
        return true;
    }
    
    public Optional<ContractEntity> getContract(String id) {
        return contractRepository.findById(id);
    }

    private boolean verifySignature(String issuerId, String signature) {
        // MVP: Assume all non-empty signatures are valid
        return signature != null && !signature.trim().isEmpty();
    }
}