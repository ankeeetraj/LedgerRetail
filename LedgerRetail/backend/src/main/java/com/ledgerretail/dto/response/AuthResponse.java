package com.ledgerretail.dto.response;

import lombok.*;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class AuthResponse {
    private String token;
    private UserInfo user;

    @Data @AllArgsConstructor @NoArgsConstructor @Builder
    public static class UserInfo {
        private Long   id;
        private String name;
        private String email;
        private String role;
    }
}
