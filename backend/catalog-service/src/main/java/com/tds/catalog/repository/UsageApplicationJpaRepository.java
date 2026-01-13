package com.tds.catalog.repository;

import com.tds.catalog.entity.UsageApplicationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UsageApplicationJpaRepository extends JpaRepository<UsageApplicationEntity, String> {
    List<UsageApplicationEntity> findByProviderId(String providerId);
}
