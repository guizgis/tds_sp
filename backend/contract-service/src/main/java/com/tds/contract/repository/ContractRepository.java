package com.tds.contract.repository;

import com.tds.contract.model.ContractEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractRepository extends JpaRepository<ContractEntity, String> {
}
