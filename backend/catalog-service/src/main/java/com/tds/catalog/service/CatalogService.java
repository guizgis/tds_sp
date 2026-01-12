package com.tds.catalog.service;

import com.tds.catalog.model.CatalogItem;
import com.tds.catalog.model.CatalogItemRequest;
import com.tds.catalog.model.TopicCategory;
import com.tds.catalog.model.UsageApplication;
import com.tds.catalog.model.UsageRequest;

import java.util.List;

public interface CatalogService {
    CatalogItem registerCatalog(CatalogItemRequest request);
    CatalogItem getCatalog(String id);
    List<CatalogItem> searchCatalogs(String keyword, TopicCategory topicCategory, String industryCategory, String status, String spaceId);
    CatalogItem updateCatalog(String id, CatalogItemRequest request);
    void cancelCatalog(String id);
    
    // Application
    UsageApplication submitApplication(String catalogId, UsageRequest request);
    List<UsageApplication> listApplications(String providerId);
    void auditApplication(String id, boolean approved);
    
    // Admin
    void auditCatalog(String id, boolean approved);
}
