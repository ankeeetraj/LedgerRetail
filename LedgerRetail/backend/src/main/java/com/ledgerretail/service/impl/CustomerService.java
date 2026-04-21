package com.ledgerretail.service.impl;

import com.ledgerretail.dto.request.CustomerRequest;
import com.ledgerretail.dto.response.CustomerResponse;
import com.ledgerretail.entity.Customer;
import com.ledgerretail.exception.DuplicateResourceException;
import com.ledgerretail.exception.ResourceNotFoundException;
import com.ledgerretail.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Transactional(readOnly = true)
    public Page<CustomerResponse> getAll(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (search != null && !search.isBlank())
            return customerRepository.search(search, pageable).map(CustomerResponse::from);
        return customerRepository.findAll(pageable).map(CustomerResponse::from);
    }

    @Transactional(readOnly = true)
    public CustomerResponse getById(Long id) {
        return CustomerResponse.from(findOrThrow(id));
    }

    public CustomerResponse create(CustomerRequest req) {
        if (req.getEmail() != null && customerRepository.existsByEmail(req.getEmail()))
            throw new DuplicateResourceException("Email already registered: " + req.getEmail());

        Customer customer = Customer.builder()
                .name(req.getName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .address(req.getAddress())
                .company(req.getCompany())
                .status(req.getStatus() != null ? req.getStatus() : Customer.Status.ACTIVE)
                .build();

        return CustomerResponse.from(customerRepository.save(customer));
    }

    public CustomerResponse update(Long id, CustomerRequest req) {
        Customer customer = findOrThrow(id);

        if (req.getEmail() != null
                && !req.getEmail().equals(customer.getEmail())
                && customerRepository.existsByEmail(req.getEmail()))
            throw new DuplicateResourceException("Email already registered: " + req.getEmail());

        customer.setName(req.getName());
        if (req.getEmail()   != null) customer.setEmail(req.getEmail());
        if (req.getPhone()   != null) customer.setPhone(req.getPhone());
        if (req.getAddress() != null) customer.setAddress(req.getAddress());
        if (req.getCompany() != null) customer.setCompany(req.getCompany());
        if (req.getStatus()  != null) customer.setStatus(req.getStatus());

        return CustomerResponse.from(customerRepository.save(customer));
    }

    public void delete(Long id) {
        if (!customerRepository.existsById(id))
            throw new ResourceNotFoundException("Customer", id);
        customerRepository.deleteById(id);
    }

    public Customer findOrThrow(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", id));
    }
}
