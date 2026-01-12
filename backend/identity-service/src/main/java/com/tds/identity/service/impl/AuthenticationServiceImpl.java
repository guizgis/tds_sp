package com.tds.identity.service.impl;

import com.tds.identity.model.LoginRequest;
import com.tds.identity.model.LoginResponse;
import com.tds.identity.entity.IdentityEntity;
import com.tds.identity.repository.IdentityJpaRepository;
import com.tds.identity.service.AuthenticationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final IdentityJpaRepository repository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AuthenticationServiceImpl(IdentityJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        String identityCode = request.getIdentityCode();
        IdentityEntity entity = repository.findById(identityCode).orElseThrow(() -> new RuntimeException("User not found"));

        if (!"1".equals(entity.getStatus())) {
            LoginResponse fail = new LoginResponse();
            fail.setCode("301002");
            fail.setMessage("Inactive status: " + entity.getStatus());
            return fail;
        }

        String authCode = "mock-auth-code-" + UUID.randomUUID().toString();
        authCodeStore.put(authCode, identityCode);
        
        LoginResponse response = new LoginResponse();
        response.setCode("200");
        response.setAuthCode(authCode);
        return response;
    }

    @Override
    public String exchangeToken(String authCode) {
        String id = authCodeStore.get(authCode);
        if (id == null) throw new RuntimeException("Invalid authCode");
        String token = "mock-access-token-" + UUID.randomUUID().toString();
        accessTokenStore.put(token, id);
        return token;
    }

    @Override
    public Object validateToken(String token) {
        return accessTokenStore.get(token);
    }

    private final Map<String, String> authCodeStore = new ConcurrentHashMap<>();
    private final Map<String, String> accessTokenStore = new ConcurrentHashMap<>();
}