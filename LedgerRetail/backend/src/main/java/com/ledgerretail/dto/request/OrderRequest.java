package com.ledgerretail.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequest {

    private Long customerId;          // null = walk-in

    @NotEmpty
    private List<OrderItemRequest> items;

    @DecimalMin("0.0")
    private BigDecimal discount = BigDecimal.ZERO;

    private String paymentMethod;     // "cash" | "card"

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long productId;

        @NotNull @Min(1)
        private Integer quantity;
    }
}
