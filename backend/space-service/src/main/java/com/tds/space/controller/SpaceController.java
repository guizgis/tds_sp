package com.tds.space.controller;

import com.tds.space.api.SpaceApi;
import com.tds.space.api.MonitoringApi;
import com.tds.space.entity.SpaceEntity;
import com.tds.space.entity.UsageLogEntity;
import com.tds.space.model.*;
import com.tds.space.repository.SpaceRepository;
import com.tds.space.repository.UsageLogRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class SpaceController implements SpaceApi, MonitoringApi {

    private final SpaceRepository spaceRepository;
    private final UsageLogRepository usageLogRepository;
    private final NativeWebRequest request;

    public SpaceController(SpaceRepository spaceRepository, UsageLogRepository usageLogRepository, NativeWebRequest request) {
        this.spaceRepository = spaceRepository;
        this.usageLogRepository = usageLogRepository;
        this.request = request;
    }

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.ofNullable(request);
    }

    @Override
    public ResponseEntity<List<Space>> spacesGet() {
        List<Space> spaces = spaceRepository.findAll().stream()
                .map(this::mapToModel)
                .collect(Collectors.toList());
        return ResponseEntity.ok(spaces);
    }

    @Override
    public ResponseEntity<Space> spacesPost(SpaceCreateRequest spaceCreateRequest) {
        SpaceEntity entity = new SpaceEntity();
        entity.setId(UUID.randomUUID().toString());
        entity.setName(spaceCreateRequest.getName());
        entity.setDescription(spaceCreateRequest.getDescription());
        entity.setStatus("PENDING"); 
        if (spaceCreateRequest.getUsagePolicies() != null) {
            entity.setUsagePolicies(String.join(",", spaceCreateRequest.getUsagePolicies()));
        }
        entity.setCreatedAt(LocalDateTime.now());
        
        SpaceEntity saved = spaceRepository.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToModel(saved));
    }

    @Override
    public ResponseEntity<Space> spacesIdGet(String id) {
        return spaceRepository.findById(id)
                .map(this::mapToModel)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Space> spacesIdPut(String id, SpaceUpdateRequest spaceUpdateRequest) {
        return spaceRepository.findById(id)
                .map(entity -> {
                    if (spaceUpdateRequest.getName() != null) entity.setName(spaceUpdateRequest.getName());
                    if (spaceUpdateRequest.getDescription() != null) entity.setDescription(spaceUpdateRequest.getDescription());
                    if (spaceUpdateRequest.getStatus() != null) entity.setStatus(spaceUpdateRequest.getStatus().getValue());
                    if (spaceUpdateRequest.getUsagePolicies() != null) {
                        entity.setUsagePolicies(String.join(",", spaceUpdateRequest.getUsagePolicies()));
                    }
                    if (spaceUpdateRequest.getResourceIds() != null) {
                        entity.setResourceIds(String.join(",", spaceUpdateRequest.getResourceIds()));
                    }
                    return spaceRepository.save(entity);
                })
                .map(this::mapToModel)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Void> spacesIdDelete(String id) {
        if (spaceRepository.existsById(id)) {
            spaceRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<Void> spacesIdReportPost(String id) {
        // NDI-TR-2025-02 Operational & Business Monitoring
        System.out.println("NDI-TR-2025-02: Reporting operational metrics for space: " + id);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<List<UsageLog>> spacesIdUsageLogsGet(String id) {
        List<UsageLog> logs = usageLogRepository.findBySpaceId(id).stream()
                .map(entity -> {
                    UsageLog model = new UsageLog();
                    model.setId(entity.getId());
                    model.setSpaceId(entity.getSpaceId());
                    model.setResourceId(entity.getResourceId());
                    model.setParticipantId(entity.getParticipantId());
                    model.setAction(entity.getAction());
                    model.setStatus(entity.getStatus());
                    model.setEvidenceHash(entity.getEvidenceHash());
                    model.setTimestamp(entity.getTimestamp().atOffset(ZoneOffset.UTC));
                    return model;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(logs);
    }

    @Override
    public ResponseEntity<Void> spacesIdSimulateUsagePost(String id, SpacesIdSimulateUsagePostRequest req) {
        UsageLogEntity entity = new UsageLogEntity();
        entity.setSpaceId(id);
        entity.setResourceId(req.getResourceId());
        entity.setParticipantId(req.getParticipantId());
        entity.setAction(req.getAction());
        entity.setStatus(req.getIsViolation() ? "VIOLATION" : "SUCCESS");
        entity.setEvidenceHash("sha256:" + UUID.randomUUID().toString());
        entity.setTimestamp(LocalDateTime.now());
        
        usageLogRepository.save(entity);
        
        if (req.getIsViolation()) {
            System.err.println("ALARM: Policy violation detected in space " + id + " by participant " + req.getParticipantId());
        }
        
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> spacesIdAuditPost(String id, SpacesIdAuditPostRequest spacesIdAuditPostRequest) {
        return spaceRepository.findById(id)
                .map(entity -> {
                    if (spacesIdAuditPostRequest.getApproved()) {
                        entity.setStatus("ACTIVE");
                        System.out.println("NDI-TR-2025-02: Registering APPROVED space " + id + " to functional node.");
                    } else {
                        entity.setStatus("INACTIVE");
                    }
                    spaceRepository.save(entity);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private Space mapToModel(SpaceEntity entity) {
        Space model = new Space();
        model.setId(entity.getId());
        model.setName(entity.getName());
        model.setDescription(entity.getDescription());
        model.setStatus(Space.StatusEnum.fromValue(entity.getStatus()));
        if (entity.getUsagePolicies() != null && !entity.getUsagePolicies().isEmpty()) {
            model.setUsagePolicies(Arrays.asList(entity.getUsagePolicies().split(",")));
        }
        if (entity.getResourceIds() != null && !entity.getResourceIds().isEmpty()) {
            model.setResourceIds(Arrays.asList(entity.getResourceIds().split(",")));
        }
        model.setCreatedAt(entity.getCreatedAt().atOffset(ZoneOffset.UTC));
        return model;
    }
}
