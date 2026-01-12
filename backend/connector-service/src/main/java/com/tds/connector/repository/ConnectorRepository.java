package com.tds.connector.repository;

import com.tds.connector.entity.ConnectorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConnectorRepository extends JpaRepository<ConnectorEntity, String> {
}