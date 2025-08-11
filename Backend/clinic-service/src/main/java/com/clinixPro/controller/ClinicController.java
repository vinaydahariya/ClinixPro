package com.clinixPro.controller;

import com.clinixPro.payload.dto.ClinicDto;
import com.clinixPro.payload.dto.UserDto;
import com.clinixPro.entity.Clinic;
import com.clinixPro.service.ClinicService;
import com.clinixPro.service.client.UserFeignClient;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clinics")
@RequiredArgsConstructor
public class ClinicController {

    private final ClinicService clinicService;
    private final ModelMapper modelMapper;
    private final UserFeignClient userFeignClient;

    @PostMapping
    public ResponseEntity<ClinicDto> createClinic(
            @RequestBody ClinicDto clinicDto,
            @RequestHeader("Authorization") String jwt) throws Exception {

        // ✅ 1. Get logged-in user info
        UserDto userDto = userFeignClient.getUserProfile(jwt).getBody();
        if (userDto == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // ✅ 2. Create clinic
        Clinic clinic = clinicService.createClinic(clinicDto, userDto);

        // ✅ 3. If user is CUSTOMER → Change role to CLINIC_OWNER
        if ("CUSTOMER".equalsIgnoreCase(userDto.getRole())) {
            userFeignClient.updateUserRole(userDto.getId(), "CLINIC_OWNER", jwt);
        }

        ClinicDto clinicDto1 = modelMapper.map(clinic, ClinicDto.class);
        return new ResponseEntity<>(clinicDto1, HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    public ResponseEntity<ClinicDto> updateClinic(
        @PathVariable("id") Long clinicId,
        @RequestBody ClinicDto clinicDto,
        @RequestHeader("Authorization") String jwt) throws Exception {
        UserDto userDto = userFeignClient.getUserProfile(jwt).getBody();
        Clinic clinic = clinicService.updateClinic(clinicDto, userDto, clinicId);
        ClinicDto clinicDto1 = modelMapper.map(clinic, ClinicDto.class);
        return new ResponseEntity<>(clinicDto1, HttpStatus.OK);
    }


    @GetMapping
    public ResponseEntity<List<ClinicDto>> getClinics(
            ) throws Exception {


        List<Clinic> clinics = clinicService.getAllClinics();
        List<ClinicDto> clinicDtos = clinics.stream()
                .map(clinic -> modelMapper.map(clinic, ClinicDto.class))
                .toList();

        return new ResponseEntity<>(clinicDtos, HttpStatus.OK);
    }

    @GetMapping("/{clinicId}")
    public ResponseEntity<ClinicDto> getClinicById(
            @PathVariable Long clinicId
    ) throws Exception{
        Clinic clinic = clinicService.getClinicById(clinicId);
        ClinicDto clinicDto = modelMapper.map(clinic, ClinicDto.class);
        return new  ResponseEntity<>(clinicDto, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ClinicDto>> searchClinics(
            @RequestParam("city") String city
    ) throws Exception {
        List<Clinic> clinics = clinicService.searchClinicByCity(city);

        List<ClinicDto> clinicDtos = clinics.stream().map((clinic) -> {
            ClinicDto clinicDto = modelMapper.map(clinic, ClinicDto.class);
            return clinicDto;
        }).toList();

        return ResponseEntity.ok(clinicDtos);
    }



    @GetMapping("/owner")
    public ResponseEntity<ClinicDto> getClinicByOwnerId(
            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        // Get the user info from JWT via Feign client
        UserDto userDto = userFeignClient.getUserProfile(jwt).getBody();

        if (userDto == null) {
            throw new Exception("User not found with this token");
        }

        // Fetch clinic by owner ID (user ID)
        Clinic clinic = clinicService.getClinicByOwnerId(userDto.getId());

        if (clinic == null) {
            throw new Exception("Clinic not found for user ID: " + userDto.getId());
        }

        // Convert to DTO
        ClinicDto clinicDto = modelMapper.map(clinic, ClinicDto.class);

        return ResponseEntity.ok(clinicDto);
    }

    @DeleteMapping("/{clinicId}")
    public ResponseEntity<String> deleteClinic(
            @PathVariable Long clinicId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        // ✅ 1. Get logged-in user info
        UserDto userDto = userFeignClient.getUserProfile(jwt).getBody();

        if (userDto == null) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        // ✅ 2. Check role
        if (!"ADMIN".equalsIgnoreCase(userDto.getRole())) {
            return new ResponseEntity<>("Access denied! Only admin can delete clinics.", HttpStatus.FORBIDDEN);
        }

        // ✅ 3. Call service to delete
        clinicService.deleteClinic(clinicId);

        return new ResponseEntity<>("Clinic deleted successfully", HttpStatus.OK);
    }


}