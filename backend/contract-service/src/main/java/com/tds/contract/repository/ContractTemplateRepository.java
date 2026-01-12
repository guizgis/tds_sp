package com.tds.contract.repository;

import com.tds.contract.model.ContractTemplateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractTemplateRepository extends JpaRepository<ContractTemplateEntity, Long> {
}
