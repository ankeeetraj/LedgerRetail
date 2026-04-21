package com.ledgerretail.dto.response;

import com.ledgerretail.entity.Customer;
import lombok.*;

import java.time.LocalDateTime;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class CustomerResponse {
    private Long        id;
    private String      name;
    private String      email;
    private String      phone;
    private String      address;
    private String      company;
    private String      status;
    private LocalDateTime createdAt;

    public static CustomerResponse from(Customer c) {
        return CustomerResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .email(c.getEmail())
                .phone(c.getPhone())
                .address(c.getAddress())
                .company(c.getCompany())
                .status(c.getStatus() != null ? c.getStatus().name() : "ACTIVE")
                .createdAt(c.getCreatedAt())
                .build();
    }
}
