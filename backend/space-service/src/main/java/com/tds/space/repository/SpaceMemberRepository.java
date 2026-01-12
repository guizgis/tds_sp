package com.tds.space.repository;

import com.tds.space.entity.SpaceMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SpaceMemberRepository extends JpaRepository<SpaceMemberEntity, String> {
    List<SpaceMemberEntity> findBySpaceId(String spaceId);
    Optional<SpaceMemberEntity> findBySpaceIdAndParticipantId(String spaceId, String participantId);
}
