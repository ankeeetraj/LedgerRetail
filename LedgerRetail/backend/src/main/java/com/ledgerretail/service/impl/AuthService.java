package com.ledgerretail.service.impl;

import com.ledgerretail.dto.request.LoginRequest;
import com.ledgerretail.dto.request.RegisterRequest;
import com.ledgerretail.dto.response.AuthResponse;
import com.ledgerretail.entity.User;
import com.ledgerretail.exception.DuplicateResourceException;
import com.ledgerretail.repository.UserRepository;
import com.ledgerretail.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository        userRepository;
    private final PasswordEncoder       passwordEncoder;
    private final JwtUtil               jwtUtil;
    private final AuthenticationManager authManager;

    public AuthResponse login(LoginRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user  = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String jwt = jwtUtil.generateToken(user);

        return buildResponse(user, jwt);
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : User.Role.CASHIER)
                .build();

        userRepository.save(user);
        String jwt = jwtUtil.generateToken(user);
        return buildResponse(user, jwt);
    }

    private AuthResponse buildResponse(User user, String jwt) {
        return AuthResponse.builder()
                .token(jwt)
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .build())
                .build();
    }
}
