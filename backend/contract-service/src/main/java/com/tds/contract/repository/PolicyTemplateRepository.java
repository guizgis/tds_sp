package com.tds.contract.repository;

import com.tds.contract.model.PolicyTemplateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PolicyTemplateRepository extends JpaRepository<PolicyTemplateEntity, Long> {
}
