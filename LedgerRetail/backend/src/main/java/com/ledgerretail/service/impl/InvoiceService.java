package com.ledgerretail.service.impl;

import com.ledgerretail.dto.response.InvoiceResponse;
import com.ledgerretail.entity.Invoice;
import com.ledgerretail.exception.ResourceNotFoundException;
import com.ledgerretail.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public Page<InvoiceResponse> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return invoiceRepository.findAll(pageable).map(InvoiceResponse::from);
    }

    public InvoiceResponse getById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", id));
        return InvoiceResponse.from(invoice);
    }

    public InvoiceResponse getByInvoiceNumber(String number) {
        Invoice invoice = invoiceRepository.findByInvoiceNumber(number)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Invoice not found: " + number));
        return InvoiceResponse.from(invoice);
    }
}
