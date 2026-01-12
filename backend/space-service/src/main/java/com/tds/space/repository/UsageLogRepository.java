package com.tds.space.repository;

import com.tds.space.entity.UsageLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UsageLogRepository extends JpaRepository<UsageLogEntity, String> {
    List<UsageLogEntity> findBySpaceId(String spaceId);
}
