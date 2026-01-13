package com.tds.catalog.service.impl;

import com.tds.catalog.model.*;
import com.tds.catalog.entity.CatalogEntity;
import com.tds.catalog.entity.UsageApplicationEntity;
import com.tds.catalog.repository.CatalogJpaRepository;
import com.tds.catalog.repository.UsageApplicationJpaRepository;
import com.tds.catalog.service.CatalogService;
import com.tds.catalog.util.CatalogIdentifierUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CatalogServiceImpl implements CatalogService {

    private final CatalogJpaRepository catalogRepository;
    private final UsageApplicationJpaRepository applicationRepository;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    public CatalogServiceImpl(CatalogJpaRepository catalogRepository, UsageApplicationJpaRepository applicationRepository) {
        this.catalogRepository = catalogRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    public CatalogItem registerCatalog(CatalogItemRequest request) {
        try {
            CatalogEntity entity = new CatalogEntity();
            String id = "TMP_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            
            entity.setId(id);
            entity.setName(request.getName().replace("(待审)", "").replace("待审", ""));
            entity.setCatalogType("PRODUCT");
            entity.setDescription(request.getDescription());
            entity.setVersion("1.0");
            entity.setStatus("PENDING");
            entity.setProviderId(request.getProviderId());
            entity.setTargetSpaceId(request.getTargetSpaceId());
            entity.setCreateTime(OffsetDateTime.now());
            entity.setUpdateTime(OffsetDateTime.now());
            entity.setFullDataJson(objectMapper.writeValueAsString(request));
            catalogRepository.save(entity);
            
            return getCatalogItemFromEntity(entity);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public CatalogItem getCatalog(String id) {
        return catalogRepository.findById(id).map(this::getCatalogItemFromEntity).orElse(null);
    }

    @Override
    public List<CatalogItem> searchCatalogs(String keyword, String catalogType, String topicCategory, String industryCategory, String status, String spaceId) {
        List<CatalogEntity> all = catalogRepository.findAll();
        return all.stream()
                .filter(e -> {
                    if (keyword != null && !keyword.isEmpty() && !e.getName().contains(keyword)) return false;
                    
                    // Add topicCategory filter
                    if (topicCategory != null && !topicCategory.isEmpty()) {
                        String metadata = e.getFullDataJson();
                        if (metadata == null || !metadata.contains(topicCategory)) return false;
                    }
                    
                    if (status != null && !status.isEmpty()) {
                        String dbStatus = e.getStatus();
                        boolean statusMatch = false;
                        if ("待审核".equals(status) || "PENDING".equalsIgnoreCase(status)) {
                            statusMatch = "PENDING".equalsIgnoreCase(dbStatus) || "待审核".equals(dbStatus);
                        } else if ("审核通过".equals(status) || "AUDITED".equalsIgnoreCase(status)) {
                            statusMatch = "AUDITED".equalsIgnoreCase(dbStatus) || "审核通过".equals(dbStatus);
                        } else if ("已登记".equals(status) || "REGISTERED".equalsIgnoreCase(status)) {
                            statusMatch = "REGISTERED".equalsIgnoreCase(dbStatus) || "已登记".equals(dbStatus);
                        } else if ("已发布".equals(status) || "ACTIVE".equalsIgnoreCase(status)) {
                            statusMatch = "ACTIVE".equalsIgnoreCase(dbStatus) || "已发布".equals(dbStatus);
                        } else {
                            statusMatch = status.equalsIgnoreCase(dbStatus);
                        }
                        if (!statusMatch) return false;
                    }

                    if (catalogType != null && !catalogType.isEmpty() && !"ALL".equalsIgnoreCase(catalogType)) {
                        String type = e.getCatalogType();
                        if (type == null) type = "PRODUCT";
                        if (!catalogType.equalsIgnoreCase(type)) return false;
                    }
                    return true;
                })
                .map(this::getCatalogItemFromEntity)
                .collect(Collectors.toList());
    }

    private CatalogItem getCatalogItemFromEntity(CatalogEntity entity) {
        CatalogItem item = new CatalogItem();
        item.setId(entity.getId());
        item.setName(entity.getName());
        item.setDescription(entity.getDescription());
        item.setVersion(entity.getVersion());
        
        String status = entity.getStatus();
        if ("PENDING".equalsIgnoreCase(status) || "0".equals(status)) status = "待审核";
        else if ("ACTIVE".equalsIgnoreCase(status) || "1".equals(status)) status = "已发布";
        else if ("AUDITED".equalsIgnoreCase(status)) status = "审核通过";
        else if ("REGISTERED".equalsIgnoreCase(status)) status = "已登记";
        item.setStatus(status);
        
        item.setCreateTime(entity.getCreateTime());
        item.setUpdateTime(entity.getUpdateTime());
        item.setProviderId(entity.getProviderId());
        item.setTargetSpaceId(entity.getTargetSpaceId());
        item.setCatalogType(CatalogItem.CatalogTypeEnum.PRODUCT);
        item.setProviderName(getProviderName(entity.getProviderId()));

        try {
            if (entity.getFullDataJson() != null) {
                CatalogItemRequest req = objectMapper.readValue(entity.getFullDataJson(), CatalogItemRequest.class);
                item.setTopicCategory(req.getTopicCategory());
                item.setIndustryCategory(req.getIndustryCategory());
                item.setSourceType(req.getSourceType());
                item.setDeliveryMode(req.getDeliveryMode());
                item.setSecurityLevel(req.getSecurityLevel());
            }
        } catch (Exception ex) {}
        return item;
    }

    @Override
    public void auditCatalog(String id, boolean approved) {
        catalogRepository.findById(id).ifPresent(e -> {
            String currentStatus = e.getStatus();
            if (!approved) {
                e.setStatus("已驳回");
            } else {
                if ("PENDING".equalsIgnoreCase(currentStatus) || "待审核".equals(currentStatus)) {
                    e.setStatus("AUDITED");
                } else if ("AUDITED".equalsIgnoreCase(currentStatus) || "审核通过".equals(currentStatus)) {
                    try {
                        String typeId = "A";
                        String newId = CatalogIdentifierUtil.generateIdentifier("110101", "000000001", typeId, new Random().nextInt(999999));
                        catalogRepository.delete(e);
                        e.setId(newId);
                        e.setStatus("REGISTERED");
                    } catch (Exception ex) { e.setStatus("登记失败"); }
                } else {
                    e.setStatus("ACTIVE");
                }
            }
            e.setUpdateTime(OffsetDateTime.now());
            catalogRepository.save(e);
        });
    }

    @Override
    public UsageApplication submitApplication(String catalogId, UsageRequest request) {
        return catalogRepository.findById(catalogId).map(catalog -> {
            UsageApplicationEntity entity = new UsageApplicationEntity();
            entity.setId("APP_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            entity.setCatalogId(catalogId);
            entity.setCatalogName(catalog.getName());
            entity.setApplicantId(request.getApplicantId());
            entity.setProviderId(catalog.getProviderId());
            entity.setReason(request.getReason());
            entity.setStatus("PENDING");
            entity.setSubmitTime(OffsetDateTime.now());
            applicationRepository.save(entity);
            return mapToModel(entity);
        }).orElseThrow(() -> new RuntimeException("Catalog not found"));
    }

    @Override
    public List<UsageApplication> listApplications(String providerId) {
        List<UsageApplicationEntity> entities = (providerId != null && !providerId.isEmpty()) 
            ? applicationRepository.findByProviderId(providerId) : applicationRepository.findAll();
        return entities.stream().map(this::mapToModel).collect(Collectors.toList());
    }

    @Override
    public void auditApplication(String id, boolean approved) {
        applicationRepository.findById(id).ifPresent(e -> {
            e.setStatus(approved ? "APPROVED" : "REJECTED");
            applicationRepository.save(e);
        });
    }

    private UsageApplication mapToModel(UsageApplicationEntity entity) {
        UsageApplication model = new UsageApplication();
        model.setId(entity.getId());
        model.setCatalogId(entity.getCatalogId());
        model.setCatalogName(entity.getCatalogName());
        model.setApplicantId(entity.getApplicantId());
        model.setProviderId(entity.getProviderId());
        model.setReason(entity.getReason());
        model.setSubmitTime(entity.getSubmitTime());
        try {
            model.setStatus(UsageApplication.StatusEnum.valueOf(entity.getStatus()));
        } catch (Exception e) {
            model.setStatus(UsageApplication.StatusEnum.PENDING);
        }
        return model;
    }

    private String getProviderName(String providerId) {
        if (providerId == null) return "未知机构";
        if (providerId.contains("weather")) return "国家气象局信息中心";
        if (providerId.contains("finance")) return "中数金融科技有限公司";
        if (providerId.contains("active_corp")) return "中数信安技术有限公司";
        return "江苏智数科技有限公司";
    }

    @Override public CatalogItem updateCatalog(String id, CatalogItemRequest request) { return null; }
    @Override public void cancelCatalog(String id) {}
}
