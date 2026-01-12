package com.tds.catalog.service.impl;

import com.tds.catalog.model.*;
import com.tds.catalog.entity.CatalogEntity;
import com.tds.catalog.repository.CatalogJpaRepository;
import com.tds.catalog.service.CatalogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Service
public class CatalogServiceImpl implements CatalogService {

    private final CatalogJpaRepository catalogRepository;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    public CatalogServiceImpl(CatalogJpaRepository catalogRepository) {
        this.catalogRepository = catalogRepository;
    }

    @Override
    public CatalogItem registerCatalog(CatalogItemRequest request) {
        try {
            CatalogEntity entity = new CatalogEntity();
            String id = "110101DID:" + UUID.randomUUID().toString().substring(0, 8);
            entity.setId(id);
            entity.setName(request.getName());
            entity.setDescription(request.getDescription());
            entity.setVersion("1.0");
            entity.setStatus("PENDING");
            entity.setProviderId(request.getProviderId());
            entity.setTargetSpaceId(request.getTargetSpaceId());
            entity.setCreateTime(OffsetDateTime.now());
            entity.setUpdateTime(OffsetDateTime.now());
            entity.setFullDataJson(objectMapper.writeValueAsString(request));
            catalogRepository.save(entity);
            return mapToModel(entity, request);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public CatalogItem getCatalog(String id) {
        return catalogRepository.findById(id).map(e -> {
            try {
                CatalogItemRequest req = objectMapper.readValue(e.getFullDataJson(), CatalogItemRequest.class);
                return mapToModel(e, req);
            } catch (Exception ex) { return null; }
        }).orElse(null);
    }

    @Override
    public List<CatalogItem> searchCatalogs(String keyword, TopicCategory topicCategory, String industryCategory, String status, String spaceId) {
        return catalogRepository.findAll().stream()
                .filter(e -> {
                    if (keyword != null && !keyword.isEmpty() && !e.getName().contains(keyword)) return false;
                    if (status != null && !status.isEmpty() && !e.getStatus().equals(status)) return false;
                    if (spaceId != null && !spaceId.isEmpty() && e.getTargetSpaceId() != null && !e.getTargetSpaceId().equals(spaceId)) return false;
                    return true;
                })
                .map(e -> {
                    try {
                        CatalogItemRequest req = objectMapper.readValue(e.getFullDataJson(), CatalogItemRequest.class);
                        return mapToModel(e, req);
                    } catch (Exception ex) { return null; }
                })
                .collect(Collectors.toList());
    }

    @Override
    public void auditCatalog(String id, boolean approved) {
        catalogRepository.findById(id).ifPresent(e -> {
            e.setStatus(approved ? "ACTIVE" : "CANCELLED");
            e.setUpdateTime(OffsetDateTime.now());
            catalogRepository.save(e);
        });
    }

    // Unimplemented placeholders for simplicity
    @Override public CatalogItem updateCatalog(String id, CatalogItemRequest request) { return null; }
    @Override public void cancelCatalog(String id) {}
    @Override public UsageApplication submitApplication(String catalogId, UsageRequest request) { return null; }
    @Override public List<UsageApplication> listApplications(String providerId) { return null; }
    @Override public void auditApplication(String id, boolean approved) {}

    private CatalogItem mapToModel(CatalogEntity entity, CatalogItemRequest request) {
        CatalogItem item = new CatalogItem();
        item.setId(entity.getId());
        item.setName(entity.getName());
        item.setDescription(entity.getDescription());
        item.setVersion(entity.getVersion());
        item.setStatus(CatalogItem.StatusEnum.fromValue(entity.getStatus()));
        item.setCreateTime(entity.getCreateTime());
        item.setUpdateTime(entity.getUpdateTime());
        item.setProviderId(entity.getProviderId());
        item.setTargetSpaceId(entity.getTargetSpaceId());
        item.setTopicCategory(request.getTopicCategory());
        item.setIndustryCategory(request.getIndustryCategory());
        item.setSourceType(request.getSourceType());
        item.setDeliveryMode(request.getDeliveryMode());
        item.setUpdateFrequency(request.getUpdateFrequency());
        item.setQualityLevel(request.getQualityLevel());
        item.setSecurityLevel(request.getSecurityLevel());
        item.setServiceType(request.getServiceType());
        return item;
    }
}