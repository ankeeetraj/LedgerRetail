package com.ledgerretail.dto.request;

import com.ledgerretail.entity.Customer;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CustomerRequest {
    @NotBlank
    private String name;

    @Email
    private String email;

    private String phone;
    private String address;
    private String company;
    private Customer.Status status;
}
