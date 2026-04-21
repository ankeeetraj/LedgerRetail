package com.ledgerretail.repository;

import com.ledgerretail.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(c.name)    LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(c.email)   LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(c.phone)   LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(c.company) LIKE LOWER(CONCAT('%', :q, '%'))")
    Page<Customer> search(@Param("q") String query, Pageable pageable);
}
