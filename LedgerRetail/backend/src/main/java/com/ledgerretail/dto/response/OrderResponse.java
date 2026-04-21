package com.ledgerretail.dto.response;

import com.ledgerretail.entity.Order;
import com.ledgerretail.entity.OrderItem;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class OrderResponse {
    private Long        id;
    private String      orderId;
    private CustomerInfo customer;
    private List<ItemInfo> items;
    private BigDecimal  subtotal;
    private BigDecimal  tax;
    private BigDecimal  discount;
    private BigDecimal  totalAmount;
    private String      status;
    private String      paymentMethod;
    private LocalDateTime createdAt;

    @Data @AllArgsConstructor @NoArgsConstructor @Builder
    public static class CustomerInfo {
        private Long   id;
        private String name;
        private String email;
    }

    @Data @AllArgsConstructor @NoArgsConstructor @Builder
    public static class ItemInfo {
        private Long       productId;
        private String     productName;
        private String     sku;
        private Integer    quantity;
        private BigDecimal unitPrice;
        private BigDecimal lineTotal;
    }

    public static OrderResponse from(Order o) {
        List<ItemInfo> items = o.getItems().stream().map(i -> ItemInfo.builder()
                .productId(i.getProduct().getId())
                .productName(i.getProduct().getName())
                .sku(i.getProduct().getSku())
                .quantity(i.getQuantity())
                .unitPrice(i.getUnitPrice())
                .lineTotal(i.getLineTotal())
                .build()).collect(Collectors.toList());

        CustomerInfo ci = null;
        if (o.getCustomer() != null) {
            ci = CustomerInfo.builder()
                    .id(o.getCustomer().getId())
                    .name(o.getCustomer().getName())
                    .email(o.getCustomer().getEmail())
                    .build();
        }

        return OrderResponse.builder()
                .id(o.getId())
                .orderId(String.format("#ORD-%04d", o.getId()))
                .customer(ci)
                .items(items)
                .subtotal(o.getSubtotal())
                .tax(o.getTax())
                .discount(o.getDiscount())
                .totalAmount(o.getTotalAmount())
                .status(o.getStatus().name())
                .paymentMethod(o.getPaymentMethod())
                .createdAt(o.getCreatedAt())
                .build();
    }
}
