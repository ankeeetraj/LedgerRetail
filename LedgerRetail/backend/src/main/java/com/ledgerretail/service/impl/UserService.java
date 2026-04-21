package com.ledgerretail.service.impl;

import com.ledgerretail.dto.request.RegisterRequest;
import com.ledgerretail.dto.response.ApiResponse;
import com.ledgerretail.entity.User;
import com.ledgerretail.exception.DuplicateResourceException;
import com.ledgerretail.exception.ResourceNotFoundException;
import com.ledgerretail.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream().<Map<String, Object>>map(u -> Map.of(
                "id",        u.getId(),
                "name",      u.getName(),
                "email",     u.getEmail(),
                "role",      u.getRole().name(),
                "createdAt", u.getCreatedAt().toString()
        )).toList();
    }

    public Map<String, Object> createUser(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new DuplicateResourceException("Email already registered: " + req.getEmail());

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole() != null ? req.getRole() : User.Role.CASHIER)
                .build();
        User saved = userRepository.save(user);
        return Map.of("id", saved.getId(), "name", saved.getName(),
                      "email", saved.getEmail(), "role", saved.getRole().name());
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        if (user.getRole() == User.Role.ADMIN &&
                userRepository.findAll().stream().filter(u -> u.getRole() == User.Role.ADMIN).count() <= 1)
            throw new IllegalStateException("Cannot delete the last admin user");
        userRepository.deleteById(id);
    }

    public Map<String, Object> updateRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        user.setRole(User.Role.valueOf(role.toUpperCase()));
        User saved = userRepository.save(user);
        return Map.of("id", saved.getId(), "name", saved.getName(),
                      "email", saved.getEmail(), "role", saved.getRole().name());
    }
}
