package com.ledgerretail.service.impl;

import com.ledgerretail.dto.request.OrderRequest;
import com.ledgerretail.dto.response.DashboardStatsResponse;
import com.ledgerretail.dto.response.InvoiceResponse;
import com.ledgerretail.dto.response.OrderResponse;
import com.ledgerretail.entity.*;
import com.ledgerretail.exception.InsufficientStockException;
import com.ledgerretail.exception.ResourceNotFoundException;
import com.ledgerretail.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private static final BigDecimal TAX_RATE = new BigDecimal("0.18");

    private final OrderRepository    orderRepository;
    private final ProductRepository  productRepository;
    private final CustomerRepository customerRepository;
    private final InvoiceRepository  invoiceRepository;

    @Transactional(readOnly = true)
    public Page<OrderResponse> getAll(String status, Long customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        if (customerId != null)
            return orderRepository.findByCustomerId(customerId, pageable).map(OrderResponse::from);

        if (status != null && !status.isBlank()) {
            try {
                Order.Status s = Order.Status.valueOf(status.toUpperCase());
                return orderRepository.findByStatus(s, pageable).map(OrderResponse::from);
            } catch (IllegalArgumentException ignored) {}
        }

        return orderRepository.findAll(pageable).map(OrderResponse::from);
    }

    @Transactional(readOnly = true)
    public OrderResponse getById(Long id) {
        return OrderResponse.from(findOrThrow(id));
    }

    public OrderResponse create(OrderRequest req) {
        // 1 — Resolve customer (optional)
        Customer customer = null;
        if (req.getCustomerId() != null)
            customer = customerRepository.findById(req.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer", req.getCustomerId()));

        // 2 — Build order items + validate stock
        List<OrderItem> items    = new ArrayList<>();
        BigDecimal      subtotal = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemReq : req.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", itemReq.getProductId()));

            if (product.getStockQuantity() < itemReq.getQuantity())
                throw new InsufficientStockException(
                        product.getName(), itemReq.getQuantity(), product.getStockQuantity());

            // Deduct stock
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            BigDecimal lineTotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            items.add(OrderItem.builder()
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(product.getPrice())
                    .build());
        }

        // 3 — Calculate totals
        BigDecimal discount = req.getDiscount() != null ? req.getDiscount() : BigDecimal.ZERO;
        BigDecimal tax      = subtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total    = subtotal.add(tax).subtract(discount).max(BigDecimal.ZERO);

        // 4 — Persist order
        Order order = Order.builder()
                .customer(customer)
                .subtotal(subtotal)
                .tax(tax)
                .discount(discount)
                .totalAmount(total)
                .paymentMethod(req.getPaymentMethod())
                .status(Order.Status.PROCESSING)
                .build();

        items.forEach(order::addItem);
        Order saved = orderRepository.save(order);

        // 5 — Auto-generate invoice
        generateInvoice(saved);

        return OrderResponse.from(saved);
    }

    public OrderResponse updateStatus(Long id, String status) {
        Order order = findOrThrow(id);
        try {
            order.setStatus(Order.Status.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
        return OrderResponse.from(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getInvoice(Long orderId) {
        Invoice invoice = invoiceRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Invoice not found for order: " + orderId));
        return InvoiceResponse.from(invoice);
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        LocalDateTime monthStart = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);

        return DashboardStatsResponse.builder()
                .totalSales(orderRepository.sumTotalRevenue())
                .totalOrders(orderRepository.count())
                .totalCustomers(customerRepository.count())
                .lowStockCount(productRepository.countLowStockProducts(10))
                .activeOrders(orderRepository.countActiveOrders())
                .fulfilledOrders(orderRepository.countFulfilledOrders())
                .salesThisMonth(orderRepository.sumRevenueFrom(monthStart))
                .build();
    }

    private void generateInvoice(Order order) {
        if (invoiceRepository.existsByOrderId(order.getId())) return;

        String invNumber = String.format("INV-%d-%04d",
                LocalDate.now().getYear(), order.getId());

        Invoice invoice = Invoice.builder()
                .invoiceNumber(invNumber)
                .order(order)
                .issueDate(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(14))
                .status(Invoice.Status.PAID)
                .notes("Thank you for your business.")
                .build();

        invoiceRepository.save(invoice);
    }

    public Order findOrThrow(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
    }
}
