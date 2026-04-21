package com.ledgerretail.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
    @NotBlank
    private String name;

    private String description;

    @NotNull @DecimalMin("0.0")
    private BigDecimal price;

    @NotNull @Min(0)
    private Integer stockQuantity;

    private String sku;

    private Long categoryId;

    private String categoryName; // create category on-the-fly if id not given
}
