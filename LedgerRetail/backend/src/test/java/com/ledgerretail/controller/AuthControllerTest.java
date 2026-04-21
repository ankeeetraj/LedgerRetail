package com.ledgerretail.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ledgerretail.dto.request.LoginRequest;
import com.ledgerretail.dto.response.AuthResponse;
import com.ledgerretail.service.impl.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockBean  AuthService authService;

    @Test
    void login_validCredentials_returns200WithToken() throws Exception {
        AuthResponse mockResponse = AuthResponse.builder()
                .token("mock-jwt-token")
                .user(AuthResponse.UserInfo.builder()
                        .id(1L).name("Admin").email("admin@ledger.com").role("ADMIN")
                        .build())
                .build();

        when(authService.login(any())).thenReturn(mockResponse);

        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("admin@ledger.com");
        loginReq.setPassword("admin123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("mock-jwt-token"))
                .andExpect(jsonPath("$.data.user.role").value("ADMIN"));
    }

    @Test
    void login_missingEmail_returns400() throws Exception {
        LoginRequest badReq = new LoginRequest();
        badReq.setPassword("password");  // email missing

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badReq)))
                .andExpect(status().isBadRequest());
    }
}
