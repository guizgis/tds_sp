package com.tds.identity.service;

import com.tds.identity.model.EnterpriseIdentityData;
import com.tds.identity.model.OperatorIdentityData;
import com.tds.identity.model.PersonIdentityData;
import com.tds.identity.model.RegistrationResponse;

import com.tds.identity.model.AuditRequest;
import com.tds.identity.model.RegistrationSummary;
import java.util.List;

public interface RegistrationService {
    RegistrationResponse registerPerson(PersonIdentityData data);
    RegistrationResponse registerEnterprise(EnterpriseIdentityData data);
    RegistrationResponse registerOperator(OperatorIdentityData data);
    
    // Admin methods
    List<RegistrationSummary> listRegistrations(String status, Integer page, Integer size);
    void auditRegistration(String id, AuditRequest request);
    void updateStatus(String id, String status);
    void deregister(String id);
}
