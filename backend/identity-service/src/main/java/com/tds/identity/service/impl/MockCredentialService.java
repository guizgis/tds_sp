package com.tds.identity.service.impl;

import com.tds.identity.service.CredentialService;
import org.springframework.stereotype.Service;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.UUID;

@Service
public class MockCredentialService implements CredentialService {

    @Override
    public String generateDID() {
        return "did:tds:mock:" + UUID.randomUUID().toString();
    }

    @Override
    public String issueCertificate(String subjectName) {
        // Mock X.509 Certificate simulation
        String header = "-----BEGIN CERTIFICATE-----\n";
        String footer = "\n-----END CERTIFICATE-----";
        String content = Base64.getEncoder().encodeToString(
                ("MockCertFor:" + subjectName + ":" + System.currentTimeMillis()).getBytes()
        );
        return header + content + footer;
    }

    @Override
    public String generatePublicKey() {
        try {
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
            keyGen.initialize(2048);
            KeyPair pair = keyGen.generateKeyPair();
            return Base64.getEncoder().encodeToString(pair.getPublic().getEncoded());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to generate key pair", e);
        }
    }
}
