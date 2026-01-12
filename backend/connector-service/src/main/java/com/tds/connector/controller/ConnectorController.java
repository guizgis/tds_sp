package com.tds.connector.controller;

import com.tds.connector.api.LifecycleApi;
import com.tds.connector.api.AuthenticationApi;
import com.tds.connector.api.SyncApi;
import com.tds.connector.api.GovernanceApi;
import com.tds.connector.dto.*;
import com.tds.connector.entity.ConnectorEntity;
import com.tds.connector.repository.ConnectorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.context.request.NativeWebRequest;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
public class ConnectorController implements LifecycleApi, AuthenticationApi, SyncApi, GovernanceApi {

    private final ConnectorRepository repository;
    private final NativeWebRequest request;

    public ConnectorController(ConnectorRepository repository, NativeWebRequest request) {
        this.repository = repository;
        this.request = request;
    }

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.ofNullable(request);
    }

    @Override
    public ResponseEntity<ConnectorRegisterResponse> connectorsPost(ConnectorRegisterRequest request) {
        ConnectorEntity entity = new ConnectorEntity();
        String id = "did:tds:mock:conn_" + UUID.randomUUID().toString().substring(0, 8);
        entity.setIdentityCode(id);
        
        // Base Info
        entity.setConnectorName(request.getBaseInfo().getConnectorName());
        entity.setConnectorJoinType(request.getBaseInfo().getConnectorJoinType().getValue());
        entity.setEnterpriseCode(request.getBaseInfo().getEnterpriseCode());
        if (request.getBaseInfo().getConnectorIpList() != null) {
            entity.setConnectorIpList(String.join(",", request.getBaseInfo().getConnectorIpList()));
        }
        if (request.getBaseInfo().getConnectorDomainList() != null) {
            entity.setConnectorDomainList(String.join(",", request.getBaseInfo().getConnectorDomainList()));
        }
        if (request.getBaseInfo().getEnterpriseName() != null) {
            entity.setEnterpriseName(request.getBaseInfo().getEnterpriseName());
        }

        // Extend Info
        if (request.getExtendInfo() != null) {
            entity.setSupplierName(request.getExtendInfo().getSupplierName());
            entity.setSupplierCode(request.getExtendInfo().getSupplierCode());
            entity.setConnectorSN(request.getExtendInfo().getConnectorSN());
            entity.setConnectorVersion(request.getExtendInfo().getConnectorVersion());
            if (request.getExtendInfo().getConnectorType() != null) {
                entity.setConnectorType(request.getExtendInfo().getConnectorType().getValue());
            }
            entity.setConnectorMac(request.getExtendInfo().getConnectorMac());
        }

        entity.setIdentityStatus("0"); // Pending
        entity.setAuthTime(LocalDate.now());

        repository.save(entity);

        ConnectorRegisterResponse response = new ConnectorRegisterResponse();
        response.setCode("200");
        response.setMessage("Success");
        ConnectorRegisterResponseAllOfData data = new ConnectorRegisterResponseAllOfData();
        data.setIdentityCode(id);
        data.setCredential("PENDING_APPROVAL");
        response.setData(data);

        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<BaseResponse> connectorsDeregisterPost(ConnectorDeregisterRequest request) {
        if (repository.existsById(request.getIdentityCode())) {
            ConnectorEntity entity = repository.findById(request.getIdentityCode()).get();
            entity.setIdentityStatus("3"); // 3: Deregistered
            repository.save(entity);
            
            BaseResponse response = new BaseResponse();
            response.setCode("200");
            response.setMessage("Deregistered");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<ConnectorAuthResponse> connectorsAuthPost(ConnectorAuthRequest request) {
        ConnectorAuthResponse response = new ConnectorAuthResponse();
        response.setCode("200");
        response.setMessage("Authenticated");
        ConnectorAuthResponseAllOfData data = new ConnectorAuthResponseAllOfData();
        data.setServerCredential("MOCK_SERVER_CREDENTIAL");
        data.setServerSignature("MOCK_SERVER_SIGNATURE");
        response.setData(data);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<IdentityProviderListResponse> getIdentityProviderListGet() {
        IdentityProviderListResponse response = new IdentityProviderListResponse();
        response.setCode("200");
        response.setMessage("Success");
        IdentityProviderListResponseAllOfData data = new IdentityProviderListResponseAllOfData();
        data.setRootCertList(Collections.singletonList("MOCK_ROOT_CERT"));
        response.setData(data);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<BaseResponse> syncConnectorInfoPost(ConnectorInfoSyncRequest request) {
        BaseResponse response = new BaseResponse();
        response.setCode("200");
        response.setMessage("Synced");
        return ResponseEntity.ok(response);
    }

    // --- Governance API implementation ---

    @Override
    public ResponseEntity<ConnectorListResponse> adminConnectorsGet(String status) {
        List<ConnectorEntity> entities;
        if (status != null) {
            entities = repository.findAll().stream()
                    .filter(e -> status.equals(e.getIdentityStatus()))
                    .collect(Collectors.toList());
        } else {
            entities = repository.findAll();
        }

        ConnectorListResponse response = new ConnectorListResponse();
        response.setCode("200");
        response.setMessage("Success");
        
        List<Object> dataList = entities.stream().map(e -> {
            // Mapping entity to the expected DTO structure manually for now 
            // since the generated DTO might be slightly different or internal
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("identityCode", e.getIdentityCode());
            map.put("connectorName", e.getConnectorName());
            map.put("connectorJoinType", e.getConnectorJoinType());
            map.put("enterpriseCode", e.getEnterpriseCode());
            map.put("identityStatus", e.getIdentityStatus());
            map.put("authTime", e.getAuthTime());
            map.put("connectorMac", e.getConnectorMac());
            map.put("enterpriseName", e.getEnterpriseName());
            return map;
        }).collect(Collectors.toList());
        
        response.setData((List)dataList);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<BaseResponse> adminConnectorsIdAuditPost(String id, AdminConnectorsIdAuditPostRequest auditRequest) {
        Optional<ConnectorEntity> optional = repository.findById(id);
        if (optional.isPresent()) {
            ConnectorEntity entity = optional.get();
            entity.setIdentityStatus(auditRequest.getApproved() ? "1" : "2"); // 1: Active, 2: Rejected
            repository.save(entity);
            
            BaseResponse response = new BaseResponse();
            response.setCode("200");
            response.setMessage("Audit completed");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
}