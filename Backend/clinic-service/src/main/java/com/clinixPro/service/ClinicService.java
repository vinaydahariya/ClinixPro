package com.clinixPro.service;

import com.clinixPro.payload.dto.ClinicDto;
import com.clinixPro.payload.dto.UserDto;
import com.clinixPro.entity.Clinic;

import java.util.List;

public interface ClinicService {

    Clinic createClinic(ClinicDto clinicDto, UserDto userDto);

    Clinic updateClinic(ClinicDto clinicDto, UserDto userDto, Long clinicId) throws Exception;

    List<Clinic> getAllClinics();

    Clinic getClinicById(Long clinicId) throws Exception;

    Clinic getClinicByOwnerId(Long ownerId);

    List<Clinic> searchClinicByCity(String city);

    void deleteClinic(Long clinicId) throws Exception;
}
