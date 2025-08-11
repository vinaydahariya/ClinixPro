package com.clinixPro.service.impl;

import com.clinixPro.entity.ServiceOffering;
import com.clinixPro.exception.ResourceNotFoundException;
import com.clinixPro.payload.dto.CategoryDto;
import com.clinixPro.payload.dto.ClinicDto;
import com.clinixPro.payload.dto.ServiceOfferingDto;
import com.clinixPro.repository.ServiceOfferingRepository;
import com.clinixPro.service.ServiceOfferingService;
import com.clinixPro.service.client.ClinicFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceOfferingServiceImpl implements ServiceOfferingService {

    private final ServiceOfferingRepository serviceOfferingRepository;
    private final ClinicFeignClient clinicFeignClient;

    @Override
    public ServiceOffering createService(ClinicDto clinicDto, ServiceOfferingDto serviceOfferingDto, CategoryDto categoryDto) {
        ServiceOffering serviceOffering = new ServiceOffering();
        serviceOffering.setImage(serviceOfferingDto.getImage());
        serviceOffering.setClinicId(clinicDto.getId());
        serviceOffering.setName(serviceOfferingDto.getName());
        serviceOffering.setDescription(serviceOfferingDto.getDescription());
        serviceOffering.setCategoryId(categoryDto.getId());
        serviceOffering.setPrice(serviceOfferingDto.getPrice());
        serviceOffering.setDuration(serviceOfferingDto.getDuration());
        return serviceOfferingRepository.save(serviceOffering);
    }

    @Override
    public ServiceOffering updateService(Long serviceOfferingId, ServiceOffering serviceOffering) throws Exception{

        ServiceOffering serviceOffering1 = serviceOfferingRepository.findById(serviceOfferingId)
                .orElseThrow(() -> new ResourceNotFoundException("Service Offering not exists with id " + serviceOfferingId));

        serviceOffering1.setImage(serviceOffering.getImage());
        serviceOffering1.setName(serviceOffering.getName());
        serviceOffering1.setDescription(serviceOffering.getDescription());
        serviceOffering1.setPrice(serviceOffering.getPrice());
        serviceOffering1.setDuration(serviceOffering.getDuration());
        return serviceOfferingRepository.save(serviceOffering1);
    }

    @Override
    public Set<ServiceOffering> getAllServiceByClinicId(Long clinicId, String categoryId) {
        Set<ServiceOffering> serviceOfferings = serviceOfferingRepository
                .findByClinicId(clinicId);
        if(categoryId!=null){
            serviceOfferings = serviceOfferings.stream().filter((serviceOffering)->serviceOffering.getCategoryId()!=null &&
                    serviceOffering.getCategoryId().equals(categoryId)).collect(Collectors.toSet());
        }
        return serviceOfferings;
    }

    @Override
    public Set<ServiceOffering> getServicesByIds(Set<Long> ids) {
        List<ServiceOffering> serviceOfferings = serviceOfferingRepository.findAllById(ids);

        return new HashSet<>(serviceOfferings);
    }

    @Override
    public ServiceOffering getServiceById(Long id )throws Exception{
        ServiceOffering serviceOffering = serviceOfferingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not offering with id " + id));
        return serviceOffering;
    }

    @Override
    public void deleteServiceById(Long serviceId) throws Exception {
        ServiceOffering service = serviceOfferingRepository.findById(serviceId)
                .orElseThrow(() -> new Exception("Service not found with id: " + serviceId));
        serviceOfferingRepository.delete(service);
    }

    @Override
    public List<ClinicDto> searchClinicsByServiceName(String serviceName) {
        List<Long> clinicIds = serviceOfferingRepository.findClinicIdsByServiceName(serviceName);

        List<ClinicDto> clinics = new ArrayList<>();
        for (Long id : clinicIds) {
            try {
                ClinicDto clinic = clinicFeignClient.getClinicById(id).getBody();
                if (clinic != null) {
                    clinics.add(clinic);
                }
            } catch (Exception e) {
                // Handle case where clinic-service is down or clinic not found
            }
        }
        return clinics;
    }

}
