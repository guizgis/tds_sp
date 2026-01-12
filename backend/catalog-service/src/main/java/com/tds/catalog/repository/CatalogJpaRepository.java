package com.tds.catalog.repository;

import com.tds.catalog.entity.CatalogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatalogJpaRepository extends JpaRepository<CatalogEntity, String> {
}
