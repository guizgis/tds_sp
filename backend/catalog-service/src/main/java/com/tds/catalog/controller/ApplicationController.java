package com.tds.catalog.controller;

import com.tds.catalog.api.ApplicationApi;
import com.tds.catalog.model.UsageApplication;
import com.tds.catalog.model.UsageRequest;
import com.tds.catalog.service.CatalogService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ApplicationController implements ApplicationApi {

    private final CatalogService catalogService;

    public ApplicationController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @PostMapping("/catalogs/apply")
    public ResponseEntity<UsageApplication> submitApplicationById(@RequestParam("id") String id, @RequestBody UsageRequest usageRequest) {
        UsageApplication app = catalogService.submitApplication(id, usageRequest);
        return new ResponseEntity<>(app, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<List<UsageApplication>> listApplications(String providerId) {
        List<UsageApplication> list = catalogService.listApplications(providerId);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PostMapping("/applications/audit")
    public ResponseEntity<Void> auditApplicationById(@RequestParam("id") String id, @RequestBody com.tds.catalog.model.AuditApplicationRequest auditApplicationRequest) {
        catalogService.auditApplication(id, auditApplicationRequest.getApproved());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Override
    public ResponseEntity<UsageApplication> submitApplication(String id, UsageRequest usageRequest) {
        return null; // Handled by /catalogs/apply
    }

    @Override
    public ResponseEntity<Void> auditApplication(String id, com.tds.catalog.model.AuditApplicationRequest req) {
        return null; // Handled by /applications/audit
    }
}