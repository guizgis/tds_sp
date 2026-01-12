package com.tds.identity.service;

public interface CredentialService {
    /**
     * Generates a unique Decentralized Identifier (DID).
     * Format: did:tds:mock:<uuid>
     */
    String generateDID();

    /**
     * Simulates issuing a digital certificate.
     * In a real scenario, this would interact with a CA.
     * @param subjectName The entity name (e.g., username or enterprise name)
     * @return A mock certificate string (PEM format simulation)
     */
    String issueCertificate(String subjectName);

    /**
     * Generates a key pair for the user.
     * @return A string representation of the Public Key
     */
    String generatePublicKey();
}
