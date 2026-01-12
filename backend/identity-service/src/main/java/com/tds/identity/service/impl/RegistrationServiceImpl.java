package com.tds.identity.service.impl;

import com.tds.identity.model.*;
import com.tds.identity.entity.IdentityEntity;
import com.tds.identity.repository.IdentityJpaRepository;
import com.tds.identity.service.CredentialService;
import com.tds.identity.service.RegistrationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Service
public class RegistrationServiceImpl implements RegistrationService {

    private final CredentialService credentialService;
    private final IdentityJpaRepository repository;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    public RegistrationServiceImpl(CredentialService credentialService, IdentityJpaRepository repository) {
        this.credentialService = credentialService;
        this.repository = repository;
    }

    @Override
    public RegistrationResponse registerPerson(PersonIdentityData data) {
        String did = credentialService.generateDID();
        data.getBaseInfo().setIdentityCode(did);
        data.getBaseInfo().setIdentityStatus("0");
        data.getBaseInfo().setAuthTime(OffsetDateTime.now());
        saveToDb(did, "Person", data.getBaseInfo().getFullName(), "0", data.getBaseInfo().getAuthTime(), data);
        return buildResponse(did, "PENDING_APPROVAL");
    }

    @Override
    public RegistrationResponse registerEnterprise(EnterpriseIdentityData data) {
        String did = credentialService.generateDID();
        data.getBaseInfo().setIdentityCode(did);
        data.getBaseInfo().setIdentityStatus("0");
        data.getBaseInfo().setAuthDate(OffsetDateTime.now());
        saveToDb(did, "Enterprise", data.getBaseInfo().getEnterpriseName(), "0", data.getBaseInfo().getAuthDate(), data);
        return buildResponse(did, "PENDING_APPROVAL");
    }

    @Override
    public RegistrationResponse registerOperator(OperatorIdentityData data) {
        String did = credentialService.generateDID();
        data.getBaseInfo().setIdentityCode(did);
        data.getBaseInfo().setAuthStatus("0");
        data.getBaseInfo().setAuthTime(OffsetDateTime.now());
        saveToDb(did, "Operator", data.getBaseInfo().getOperator(), "0", data.getBaseInfo().getAuthTime(), data);
        return buildResponse(did, "PENDING_APPROVAL");
    }

    private void saveToDb(String did, String type, String name, String status, OffsetDateTime time, Object data) {
        try {
            IdentityEntity entity = new IdentityEntity();
            entity.setIdentityCode(did);
            entity.setType(type);
            entity.setName(name);
            entity.setStatus(status);
            entity.setSubmitTime(time);
            entity.setDataJson(objectMapper.writeValueAsString(data));
            repository.save(entity);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<RegistrationSummary> listRegistrations(String status, Integer page, Integer size) {
        return repository.findAll().stream()
                .filter(e -> status == null || status.equals(e.getStatus()))
                .map(e -> {
                    RegistrationSummary s = new RegistrationSummary();
                    s.setIdentityCode(e.getIdentityCode());
                    s.setName(e.getName());
                    s.setType(e.getType());
                    s.setStatus(e.getStatus());
                    s.setSubmitTime(e.getSubmitTime());
                    return s;
                }).collect(Collectors.toList());
    }

    @Override
    public void auditRegistration(String id, AuditRequest request) {
        repository.findById(id).ifPresent(e -> {
            e.setStatus(request.getApproved() ? "1" : "2");
            repository.save(e);
        });
    }

    @Override
    public void updateStatus(String id, String status) {
        repository.findById(id).ifPresent(e -> {
            e.setStatus(status);
            repository.save(e);
        });
    }

    @Override
    public void deregister(String id) {
        repository.deleteById(id);
    }

    private RegistrationResponse buildResponse(String did, String cert) {
        RegistrationResponse response = new RegistrationResponse();
        response.setCode("200");
        RegistrationResponseAllOfData data = new RegistrationResponseAllOfData();
        data.setIdentityCode(did);
        data.setCredential(cert);
        response.setData(data);
        return response;
    }
}
