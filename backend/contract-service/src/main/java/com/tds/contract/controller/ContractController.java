package com.tds.contract.controller;

import com.tds.contract.service.ContractService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class ContractController {

    private final ContractService contractService;

    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @PostMapping("/contractCreate")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> request) {
        String name = (String) request.get("contractName");
        String summary = (String) request.get("contractAbstract");
        String signMode = (String) request.get("signMode");
        String issuerId = (String) request.get("issuerId");
        String issuerEntityId = (String) request.get("issuerEntityId");
        String signature = (String) request.get("signature");
        String policySnapshot = (String) request.get("policySnapshot");
        
        // 简化时间解析，实际应使用 ISO-8601
        LocalDateTime activationTime = LocalDateTime.now();
        LocalDateTime endTime = LocalDateTime.now().plusYears(1);

        String id = contractService.createContract(name, summary, activationTime, endTime, signMode, issuerId, issuerEntityId, signature, policySnapshot);
        
        Map<String, String> response = new HashMap<>();
        response.put("contractId", id);
        response.put("status", "0");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/contractRegistrate")
    public ResponseEntity<?> fileContract(@RequestBody Map<String, Object> request) {
        String contractId = (String) request.get("contractId");
        boolean success = contractService.fileContract(contractId);
        
        Map<String, String> response = new HashMap<>();
        response.put("status", success ? "0" : "1");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/contractNegotiate")
    public ResponseEntity<?> negotiate(@RequestBody Map<String, Object> request) {
        String contractId = (String) request.get("contractId");
        // 这里需要更复杂的转换逻辑来映射 strategy
        // MVP 阶段仅返回成功
        Map<String, String> response = new HashMap<>();
        response.put("negotiationStatus", "0");
        return ResponseEntity.ok(response);
    }
}