package com.clinixPro.controller;

import com.clinixPro.entity.User;
import com.clinixPro.payload.dto.UserDTO;
import com.clinixPro.exception.UserException;
import com.clinixPro.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody @Valid UserDTO userDto) throws UserException {
        UserDTO createdUser = userService.createUser(userDto);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception {

        UserDTO userDTO = userService.getUserFromJwt(jwt);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestHeader("Authorization") String jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) throws Exception {

        // 1. JWT se current user nikalna - apka service method
        UserDTO currentUser = userService.getUserFromJwt(jwt);

        if (currentUser == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // 2. Check karo role - sirf ADMIN allowed
        if (!"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        // 3. Pageable bana ke user data fetch karo
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<UserDTO> usersPage = userService.getAllUsers(pageable);

        // 4. Pagination info ke saath response banao
        Map<String, Object> response = new HashMap<>();
        response.put("content", usersPage.getContent());
        response.put("currentPage", usersPage.getNumber());
        response.put("totalItems", usersPage.getTotalElements());
        response.put("totalPages", usersPage.getTotalPages());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }




    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long userId) throws UserException {
        UserDTO user = userService.getUserById(userId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


    @PutMapping("/{userId}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long userId,
            @RequestBody @Valid UserDTO userDto) throws Exception {
        UserDTO updatedUser = userService.updateUser(userId, userDto);
        System.out.println("Received DTO: " + userDto);

        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUserById(
            @PathVariable Long userId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        // ✅ JWT se current logged-in user ka data lo
        UserDTO currentUser = userService.getUserFromJwt(jwt);

        // ✅ Sirf ADMIN ko allow
        if (!"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
            return new ResponseEntity<>("Access Denied: Only admin can delete users", HttpStatus.FORBIDDEN);
        }

        userService.deleteUser(userId);
        return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
    }



    // ✅ NEW: Get user role (Admin or same user)
    @GetMapping("/{userId}/role")
    public ResponseEntity<String> getUserRole(
            @PathVariable Long userId,
            @RequestHeader(value = "Authorization", required = false) String jwt) throws Exception {

        // ✅ Check if JWT is missing or empty
        if (jwt == null || jwt.isBlank()) {
            return new ResponseEntity<>("Unauthorized: Missing token", HttpStatus.UNAUTHORIZED);
        }

        // ✅ Get logged-in user info
        UserDTO currentUser = userService.getUserFromJwt(jwt);

        // ✅ Only Admin or same user can view
        if (!currentUser.getRole().equalsIgnoreCase("ADMIN")
                && !currentUser.getId().equals(userId)) {
            return new ResponseEntity<>("Access Denied", HttpStatus.FORBIDDEN);
        }

        String role = userService.getUserRole(userId);
        return new ResponseEntity<>(role, HttpStatus.OK);
    }


    // ✅ NEW: Update user role (Only Admin)
    @PutMapping("/{userId}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long userId,
            @RequestParam String role,
            @RequestHeader("Authorization") String jwt) throws Exception {

        // ✅ Verify current user
        UserDTO currentUser = userService.getUserFromJwt(jwt);

        // ✅ Allow if admin OR same user updating own role
        if (!currentUser.getRole().equalsIgnoreCase("ADMIN")
                && !currentUser.getId().equals(userId)) {
            return new ResponseEntity<>("Access Denied", HttpStatus.FORBIDDEN);
        }

        UserDTO updatedUser = userService.updateUserRole(userId, role);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchUsers(
            @RequestHeader("Authorization") String jwt,
            @RequestParam String fullName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) throws Exception {

        // ✅ Logged-in user ka data nikalo
        UserDTO currentUser = userService.getUserFromJwt(jwt);

        // ✅ Sirf Admin allow
        if (!currentUser.getRole().equalsIgnoreCase("ADMIN")) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Page<User> usersPage = userService.searchUsersByFullName(fullName, page, size);

        Map<String, Object> response = new HashMap<>();
        response.put("content", usersPage.getContent());
        response.put("currentPage", usersPage.getNumber());
        response.put("totalItems", usersPage.getTotalElements());
        response.put("totalPages", usersPage.getTotalPages());

        return ResponseEntity.ok(response);
    }


}