package com.clinixPro.service.impl;

import com.clinixPro.domain.Gender;
import com.clinixPro.domain.Role;
import com.clinixPro.payload.dto.KeycloakUserDTO;
import com.clinixPro.payload.dto.UserDTO;
import com.clinixPro.entity.User;
import com.clinixPro.exception.UserException;
import com.clinixPro.repository.UserRepository;
import com.clinixPro.service.KeyclockService;
import com.clinixPro.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final KeyclockService keyclockService;


    @Override
    @Transactional
    public UserDTO createUser(UserDTO userDto) throws UserException {

        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new UserException("Email already in use: " + userDto.getEmail());
        }

        if (userRepository.existsByPhone(userDto.getPhone())) {
            throw new UserException("Mobile number already in use: " + userDto.getPhone());
        }
        // Convert DTO to Entity
        User user = modelMapper.map(userDto, User.class);
        User savedUser = userRepository.save(user);

        // Convert Entity back to DTO
        return modelMapper.map(savedUser, UserDTO.class);
    }

    @Override
    public UserDTO getUserById(Long id) throws UserException {
        Optional<User> user = userRepository.findById(id);
        if(user.isPresent()){
            return modelMapper.map(user.get(), UserDTO.class);
        }
        throw new UserException("User not found with id: " + id);
    }

    @Override
    public Page<UserDTO> getAllUsers(Pageable pageable) {
        Page<User> usersPage = userRepository.findAll(pageable);
        return usersPage.map(user -> modelMapper.map(user, UserDTO.class));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) throws Exception {
        Optional<User> user = userRepository.findById(id);
        if(user.isEmpty()){
            throw new UserException("User does not exist with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDto) throws Exception {
        Optional<User> userOptional = userRepository.findById(id);
        if(userOptional.isEmpty()){
            throw new UserException("User not found with id: " + id);
        }

        User existingUser = userOptional.get();

        // Update only the fields that should be updatable
        modelMapper.map(userDto, existingUser);

        // Ensure ID remains the same
        existingUser.setId(id);

        if (userDto.getGender() != null && !userDto.getGender().isEmpty()) {
            existingUser.setGender(Gender.valueOf(userDto.getGender().toUpperCase()));
        }

        User updatedUser = userRepository.save(existingUser);
        return modelMapper.map(updatedUser, UserDTO.class);
    }

    @Override
    public UserDTO getUserFromJwt(String jwt) throws Exception {
        KeycloakUserDTO keycloakUserDTO = keyclockService.fetchUserProfileByJwt(jwt);
        User user = userRepository.findByEmail(keycloakUserDTO.getEmail());
        return  modelMapper.map(user, UserDTO.class);
    }

    @Override
    public String getUserRole(Long id) throws UserException {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isEmpty()) {
            throw new UserException("User not found with id: " + id);
        }
        return userOptional.get().getRole().name();
    }


    @Override
    @Transactional
    public UserDTO updateUserRole(Long id, String newRole) throws UserException {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isEmpty()) {
            throw new UserException("User not found with id: " + id);
        }

        User user = userOptional.get();

        try {
            // ✅ Normalize role string before converting
            String normalizedRole = newRole.trim().replace("-", "_").toUpperCase();
            Role roleEnum = Role.valueOf(normalizedRole);
            user.setRole(roleEnum);
        } catch (IllegalArgumentException e) {
            throw new UserException("Invalid role: " + newRole);
        }

        User updatedUser = userRepository.save(user);

        try {
            keyclockService.updateUserRoleInKeycloak(user.getEmail(), newRole);
        } catch (Exception e) {
            log.error("Failed to update role in Keycloak for user {}", user.getEmail(), e);
        }

        return modelMapper.map(updatedUser, UserDTO.class);
    }

    @Override
    public Page<User> searchUsersByFullName(String fullName, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("fullName").ascending());
        return userRepository.searchByFullName(fullName, pageable);
    }


}
