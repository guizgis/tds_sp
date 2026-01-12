package com.tds.catalog.controller;

import com.tds.catalog.api.CatalogApi;
import com.tds.catalog.model.CatalogItem;
import com.tds.catalog.model.CatalogItemRequest;
import com.tds.catalog.model.TopicCategory;
import com.tds.catalog.service.CatalogService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CatalogController implements CatalogApi {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @Override
    public ResponseEntity<CatalogItem> registerCatalogItem(CatalogItemRequest catalogItemRequest) {
        CatalogItem created = catalogService.registerCatalog(catalogItemRequest);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<List<CatalogItem>> searchCatalogs(String keyword, TopicCategory topicCategory, String industryCategory, String status, String spaceId) {
        List<CatalogItem> results = catalogService.searchCatalogs(keyword, topicCategory, industryCategory, status, spaceId);
        return new ResponseEntity<>(results, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<CatalogItem> getCatalogItem(String id) {
        CatalogItem item = catalogService.getCatalog(id);
        if (item == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(item, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<CatalogItem> updateCatalogItem(String id, CatalogItemRequest catalogItemRequest) {
        CatalogItem updated = catalogService.updateCatalog(id, catalogItemRequest);
        if (updated == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Void> cancelCatalogItem(String id) {
        catalogService.cancelCatalog(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    public ResponseEntity<Void> auditCatalogItem(String id, com.tds.catalog.model.AuditCatalogItemRequest auditCatalogItemRequest) {
        catalogService.auditCatalog(id, auditCatalogItemRequest.getApproved());
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
