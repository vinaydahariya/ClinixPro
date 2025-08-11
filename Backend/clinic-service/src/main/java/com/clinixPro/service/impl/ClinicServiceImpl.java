package com.clinixPro.service.impl;

import com.clinixPro.exception.ClinicException;
import com.clinixPro.exception.ClinicNotFoundException;
import com.clinixPro.payload.dto.ClinicDto;
import com.clinixPro.payload.dto.UserDto;
import com.clinixPro.entity.Clinic;
import com.clinixPro.repository.ClinicRepository;
import com.clinixPro.service.ClinicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClinicServiceImpl implements ClinicService {

    private final ClinicRepository clinicRepository;

    @Override
    public Clinic createClinic(ClinicDto requestData, UserDto userDto) {

        if (clinicRepository.existsByEmail(requestData.getEmail())) {
            throw new ClinicException("Clinic already exists with this email: " + requestData.getEmail());
        }
        if (clinicRepository.existsByPhoneNumber(requestData.getPhoneNumber())) {
            throw new ClinicException("Clinic already exists with this phone number: " + requestData.getPhoneNumber());
        }
        Clinic clinic = new Clinic();
        clinic.setName(requestData.getName());
        clinic.setAddress(requestData.getAddress());
        clinic.setEmail(requestData.getEmail());
        clinic.setCity(requestData.getCity());
        clinic.setImages(requestData.getImages());
        clinic.setOwnerId(userDto.getId());
        clinic.setOpenTime(requestData.getOpenTime());
        clinic.setCloseTime(requestData.getCloseTime());
        clinic.setPhoneNumber(requestData.getPhoneNumber());
        clinic.setDescription((requestData.getDescription()));
        return clinicRepository.save(clinic);
    }

    @Override
    public Clinic updateClinic(ClinicDto clinicDto, UserDto userDto, Long clinicId) throws Exception {

        Clinic existingClinic = clinicRepository.findById(clinicId)
                .orElseThrow(() -> new ClinicNotFoundException("Clinic not exist with id: " + clinicId));
        // Admin ya Owner dono ko allow karo
        boolean isAdmin = userDto.getRole().equalsIgnoreCase("ADMIN");
        boolean isOwner = clinicDto.getOwnerId().equals(userDto.getId());

        if (!isAdmin && !isOwner) {
            throw new Exception("you don't have permission to update this clinic");
        }
        if (existingClinic != null){
            existingClinic.setCity(clinicDto.getCity());
            existingClinic.setName(clinicDto.getName());
            existingClinic.setAddress(clinicDto.getAddress());
            existingClinic.setEmail(clinicDto.getEmail());
            existingClinic.setImages(clinicDto.getImages());
            existingClinic.setOpenTime(clinicDto.getOpenTime());
            existingClinic.setCloseTime(clinicDto.getCloseTime());
            existingClinic.setOwnerId(userDto.getId());
            existingClinic.setPhoneNumber(clinicDto.getPhoneNumber());
            existingClinic.setDescription(clinicDto.getDescription());
            return clinicRepository.save(existingClinic);
        }
        throw new Exception("Clinic not exist");
    }

    @Override
    public List<Clinic> getAllClinics() {
        return clinicRepository.findAll();
    }

    @Override
    public Clinic getClinicById(Long clinicId) throws Exception {
        Clinic clinic = clinicRepository.findById(clinicId)
                .orElseThrow(() -> new ClinicNotFoundException("Clinic not exist with id: " + clinicId));
        return clinic;
    }

    @Override
    public Clinic getClinicByOwnerId(Long ownerId) {
        return clinicRepository.findByOwnerId(ownerId);
    }

    @Override
    public List<Clinic> searchClinicByCity(String city) {
        return clinicRepository.searchClinic(city);
    }

    @Override
    public void deleteClinic(Long clinicId) throws Exception {
        Clinic clinic = clinicRepository.findById(clinicId)
                .orElseThrow(() -> new Exception("Clinic not found with id: " + clinicId));
        clinicRepository.delete(clinic);
    }

}
