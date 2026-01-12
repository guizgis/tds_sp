package com.tds.contract.repository;

import com.tds.contract.model.ExecutionReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExecutionReportRepository extends JpaRepository<ExecutionReportEntity, Long> {
}
