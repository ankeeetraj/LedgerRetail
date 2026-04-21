package com.ledgerretail.dto.response;

import com.ledgerretail.entity.Invoice;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class InvoiceResponse {
    private Long        id;
    private String      invoiceNumber;
    private String      status;
    private LocalDate   issueDate;
    private LocalDate   dueDate;
    private LocalDateTime createdAt;

    // Order info
    private String      orderId;
    private String      paymentMethod;
    private BigDecimal  subtotal;
    private BigDecimal  tax;
    private BigDecimal  discount;
    private BigDecimal  total;

    // Customer info
    private CustomerInfo customer;

    // Line items
    private List<OrderResponse.ItemInfo> items;

    private String notes;

    @Data @AllArgsConstructor @NoArgsConstructor @Builder
    public static class CustomerInfo {
        private Long   id;
        private String name;
        private String email;
        private String phone;
        private String address;
        private String company;
    }

    public static InvoiceResponse from(Invoice inv) {
        var order = inv.getOrder();
        var customer = order.getCustomer();

        CustomerInfo ci = customer == null ? null : CustomerInfo.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .address(customer.getAddress())
                .company(customer.getCompany())
                .build();

        List<OrderResponse.ItemInfo> items = order.getItems().stream()
                .map(i -> OrderResponse.ItemInfo.builder()
                        .productId(i.getProduct().getId())
                        .productName(i.getProduct().getName())
                        .sku(i.getProduct().getSku())
                        .quantity(i.getQuantity())
                        .unitPrice(i.getUnitPrice())
                        .lineTotal(i.getLineTotal())
                        .build())
                .toList();

        return InvoiceResponse.builder()
                .id(inv.getId())
                .invoiceNumber(inv.getInvoiceNumber())
                .status(inv.getStatus().name())
                .issueDate(inv.getIssueDate())
                .dueDate(inv.getDueDate())
                .createdAt(inv.getCreatedAt())
                .orderId(String.format("#ORD-%04d", order.getId()))
                .paymentMethod(order.getPaymentMethod())
                .subtotal(order.getSubtotal())
                .tax(order.getTax())
                .discount(order.getDiscount())
                .total(order.getTotalAmount())
                .customer(ci)
                .items(items)
                .notes(inv.getNotes())
                .build();
    }
}
