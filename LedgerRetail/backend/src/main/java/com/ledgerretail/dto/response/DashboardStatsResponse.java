package com.ledgerretail.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Data @AllArgsConstructor @NoArgsConstructor @Builder
public class DashboardStatsResponse {
    private BigDecimal totalSales;
    private long       totalOrders;
    private long       totalCustomers;
    private long       lowStockCount;
    private long       activeOrders;
    private long       fulfilledOrders;
    private BigDecimal salesThisMonth;
}
