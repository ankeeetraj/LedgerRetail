package com.ledgerretail.dto.response;

import com.ledgerretail.entity.Product;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class ProductResponse {
    private Long        id;
    private String      name;
    private String      description;
    private BigDecimal  price;
    private Integer     stockQuantity;
    private String      sku;
    private String      category;
    private Long        categoryId;
    private String      status;
    private LocalDateTime createdAt;

    public static ProductResponse from(Product p) {
        String status;
        if (p.getStockQuantity() == 0)       status = "Out of Stock";
        else if (p.getStockQuantity() < 10)  status = "Critical";
        else                                  status = "In Stock";

        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .stockQuantity(p.getStockQuantity())
                .sku(p.getSku())
                .category(p.getCategory() != null ? p.getCategory().getName() : null)
                .categoryId(p.getCategory() != null ? p.getCategory().getId() : null)
                .status(status)
                .createdAt(p.getCreatedAt())
                .build();
    }
}
