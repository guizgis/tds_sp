package com.tds.identity.controller;

import com.tds.identity.api.DefaultApi;
import com.tds.identity.model.*;
import com.tds.identity.repository.IdentityJpaRepository;
import com.tds.identity.service.AuthenticationService;
import com.tds.identity.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class IdentityController implements DefaultApi {

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }

    private final RegistrationService registrationService;
    private final AuthenticationService authenticationService;
    private final IdentityJpaRepository repository;

    @Autowired
    public IdentityController(RegistrationService registrationService, 
                              AuthenticationService authenticationService,
                              IdentityJpaRepository repository) {
        this.registrationService = registrationService;
        this.authenticationService = authenticationService;
        this.repository = repository;
    }

    @Override
    public ResponseEntity<RegistrationListResponse> adminListRegistrations(String status, Integer page, Integer size) {
        List<RegistrationSummary> list = registrationService.listRegistrations(status, page, size);
        RegistrationListResponse response = new RegistrationListResponse();
        response.setCode("200");
        response.setMessage("Success");
        response.setData(list);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<BaseResponse> adminAuditRegistration(String id, AuditRequest auditRequest) {
        registrationService.auditRegistration(id, auditRequest);
        BaseResponse response = new BaseResponse();
        response.setCode("200");
        response.setMessage("Audit Processed");
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<BaseResponse> updateIdentityStatus(String id, UpdateIdentityStatusRequest updateIdentityStatusRequest) {
        registrationService.updateStatus(id, updateIdentityStatusRequest.getStatus());
        BaseResponse response = new BaseResponse();
        response.setCode("200");
        response.setMessage("Status Updated");
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<RegistrationResponse> registerPerson(PersonIdentityData personIdentityData) {
        RegistrationResponse response = registrationService.registerPerson(personIdentityData);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<RegistrationResponse> registerEnterprise(EnterpriseIdentityData enterpriseIdentityData) {
        RegistrationResponse response = registrationService.registerEnterprise(enterpriseIdentityData);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<RegistrationResponse> registerOperator(OperatorIdentityData operatorIdentityData) {
        RegistrationResponse response = registrationService.registerOperator(operatorIdentityData);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<Void> deregisterIdentity(String id) {
        registrationService.deregister(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<LoginResponse> login(LoginRequest loginRequest) {
        LoginResponse response = authenticationService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<GetTokenResponse> getToken(GetTokenRequest getTokenRequest) {
        String accessToken = authenticationService.exchangeToken(getTokenRequest.getAuthCode());
        GetTokenResponse response = new GetTokenResponse();
        response.setCode("200");
        response.setMessage("Token Issued");
        GetTokenResponseAllOfData data = new GetTokenResponseAllOfData();
        data.setToken(accessToken);
        response.setData(data);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<GetPersonInfoResponse> getPersonInfo(TokenRequest tokenRequest) {
        String identityCode = (String) authenticationService.validateToken(tokenRequest.getToken());
        if (identityCode == null) return ResponseEntity.status(401).build();
        return repository.findById(identityCode).map(e -> {
            GetPersonInfoResponse response = new GetPersonInfoResponse();
            response.setCode("200");
            response.setData(new PersonIdentityData()); // Simplified for fix
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<GetEnterpriseInfoResponse> getEnterpriseInfo(TokenRequest tokenRequest) {
        String identityCode = (String) authenticationService.validateToken(tokenRequest.getToken());
        if (identityCode == null) return ResponseEntity.status(401).build();
        GetEnterpriseInfoResponse response = new GetEnterpriseInfoResponse();
        response.setCode("200");
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<GetOperatorInfoResponse> getOperatorInfo(TokenRequest tokenRequest) {
        String identityCode = (String) authenticationService.validateToken(tokenRequest.getToken());
        if (identityCode == null) return ResponseEntity.status(401).build();
        GetOperatorInfoResponse response = new GetOperatorInfoResponse();
        response.setCode("200");
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<GetPersonBaseInfoResponse> getPersonBaseInfo(TokenRequest tokenRequest) { return null; }
    @Override
    public ResponseEntity<GetEnterpriseBaseInfoResponse> getEnterpriseBaseInfo(TokenRequest tokenRequest) { return null; }
    @Override
    public ResponseEntity<GetOperatorBaseInfoResponse> getOperatorBaseInfo(TokenRequest tokenRequest) { return null; }
}
