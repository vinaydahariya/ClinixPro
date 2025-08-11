package com.clinixPro.repository;

import com.clinixPro.entity.ServiceOffering;
import com.clinixPro.payload.dto.ClinicDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, Long> {

    Set<ServiceOffering> findByClinicId(Long clinicId);

    @Query("SELECT DISTINCT s.clinicId FROM ServiceOffering s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :serviceName, '%'))")
    List<Long> findClinicIdsByServiceName(@Param("serviceName") String serviceName);

}
