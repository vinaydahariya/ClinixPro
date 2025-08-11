package com.clinixPro.service;

import com.clinixPro.entity.User;
import com.clinixPro.payload.dto.UserDTO;
import com.clinixPro.exception.UserException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserDTO createUser(UserDTO userDto) throws UserException;
    UserDTO getUserById(Long id) throws UserException;
    Page<UserDTO> getAllUsers(Pageable pageable);
    void deleteUser(Long id) throws Exception;
    UserDTO updateUser(Long id, UserDTO userDto) throws Exception;
    UserDTO getUserFromJwt(String jwt) throws Exception;

    // ✅ New methods
    String getUserRole(Long id) throws UserException;
    UserDTO updateUserRole(Long id, String newRole) throws UserException;
    // ✅ Add in UserService.java
    public Page<User> searchUsersByFullName(String fullName, int page, int size);


}
