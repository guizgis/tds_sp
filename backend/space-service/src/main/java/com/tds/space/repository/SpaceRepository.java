package com.tds.space.repository;

import com.tds.space.entity.SpaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpaceRepository extends JpaRepository<SpaceEntity, String> {
}
