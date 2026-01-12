package com.tds.space.controller;

import com.tds.space.api.MemberApi;
import com.tds.space.entity.SpaceMemberEntity;
import com.tds.space.model.MemberApplyRequest;
import com.tds.space.model.MemberApprovalRequest;
import com.tds.space.model.SpaceMember;
import com.tds.space.repository.SpaceMemberRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class MemberController implements MemberApi {

    private final SpaceMemberRepository memberRepository;
    private final NativeWebRequest request;

    public MemberController(SpaceMemberRepository memberRepository, NativeWebRequest request) {
        this.memberRepository = memberRepository;
        this.request = request;
    }

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.ofNullable(request);
    }

    @Override
    public ResponseEntity<Void> spacesIdMembersApplyPost(String id, MemberApplyRequest memberApplyRequest) {
        SpaceMemberEntity entity = new SpaceMemberEntity();
        entity.setSpaceId(id);
        entity.setParticipantId(memberApplyRequest.getParticipantId());
        entity.setRole(memberApplyRequest.getRequestedRole().getValue());
        entity.setStatus("PENDING");
        
        memberRepository.save(entity);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    @Override
    public ResponseEntity<Void> spacesIdMembersApprovePost(String id, MemberApprovalRequest memberApprovalRequest) {
        return memberRepository.findById(memberApprovalRequest.getApplicationId())
                .map(entity -> {
                    if (memberApprovalRequest.getApproved()) {
                        entity.setStatus("APPROVED");
                        if (memberApprovalRequest.getAssignedRole() != null) {
                            entity.setRole(memberApprovalRequest.getAssignedRole().getValue());
                        }
                    } else {
                        entity.setStatus("REJECTED");
                    }
                    memberRepository.save(entity);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<List<SpaceMember>> spacesIdMembersGet(String id) {
        List<SpaceMember> members = memberRepository.findBySpaceId(id).stream()
                .map(this::mapToModel)
                .collect(Collectors.toList());
        return ResponseEntity.ok(members);
    }

    private SpaceMember mapToModel(SpaceMemberEntity entity) {
        SpaceMember model = new SpaceMember();
        model.setParticipantId(entity.getParticipantId());
        model.setRole(entity.getRole());
        model.setStatus(SpaceMember.StatusEnum.fromValue(entity.getStatus()));
        return model;
    }
}