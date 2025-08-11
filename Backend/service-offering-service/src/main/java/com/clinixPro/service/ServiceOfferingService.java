package com.clinixPro.service;

import com.clinixPro.entity.ServiceOffering;
import com.clinixPro.payload.dto.CategoryDto;
import com.clinixPro.payload.dto.ClinicDto;
import com.clinixPro.payload.dto.ServiceOfferingDto;

import java.util.List;
import java.util.Set;

public interface ServiceOfferingService {

    ServiceOffering createService(ClinicDto clinicDto,
                                  ServiceOfferingDto serviceOfferingDto,
                                  CategoryDto categoryDto);

    ServiceOffering updateService(Long serviceOfferingId, ServiceOffering serviceOffering) throws Exception;

    Set<ServiceOffering> getAllServiceByClinicId(Long clinicId, String categoryId);

    Set<ServiceOffering> getServicesByIds(Set<Long> ids);

    ServiceOffering getServiceById(Long id) throws Exception;

    void deleteServiceById(Long serviceId) throws Exception;

    List<ClinicDto> searchClinicsByServiceName(String serviceName);

}
