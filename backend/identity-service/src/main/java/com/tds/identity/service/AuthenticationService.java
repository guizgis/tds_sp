package com.tds.identity.service;

import com.tds.identity.model.LoginRequest;
import com.tds.identity.model.LoginResponse;

public interface AuthenticationService {
    LoginResponse login(LoginRequest request);
    
    // Exchange authCode for an access token
    String exchangeToken(String authCode);
    
    // Validate token and return identity info (for GetToken flow)
    Object validateToken(String token);
}
