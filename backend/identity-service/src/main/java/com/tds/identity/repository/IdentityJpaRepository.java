package com.tds.identity.repository;

import com.tds.identity.entity.IdentityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IdentityJpaRepository extends JpaRepository<IdentityEntity, String> {
}
