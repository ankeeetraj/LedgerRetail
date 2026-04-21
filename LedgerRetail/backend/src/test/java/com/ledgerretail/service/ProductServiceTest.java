package com.ledgerretail.service;

import com.ledgerretail.dto.request.ProductRequest;
import com.ledgerretail.dto.response.ProductResponse;
import com.ledgerretail.entity.Category;
import com.ledgerretail.entity.Product;
import com.ledgerretail.exception.DuplicateResourceException;
import com.ledgerretail.exception.ResourceNotFoundException;
import com.ledgerretail.repository.CategoryRepository;
import com.ledgerretail.repository.ProductRepository;
import com.ledgerretail.service.impl.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock ProductRepository  productRepository;
    @Mock CategoryRepository categoryRepository;
    @InjectMocks ProductService productService;

    private Product sampleProduct;
    private Category sampleCategory;

    @BeforeEach
    void setUp() {
        sampleCategory = Category.builder().id(1L).name("Electronics").build();
        sampleProduct  = Product.builder()
                .id(1L).name("Test Product").sku("SKU-001")
                .price(new BigDecimal("99.99")).stockQuantity(50)
                .category(sampleCategory).build();
    }

    @Test
    void getById_existingId_returnsProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(sampleProduct));
        ProductResponse res = productService.getById(1L);
        assertThat(res.getName()).isEqualTo("Test Product");
        assertThat(res.getPrice()).isEqualByComparingTo("99.99");
    }

    @Test
    void getById_missingId_throwsNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> productService.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void create_validRequest_savesProduct() {
        ProductRequest req = new ProductRequest();
        req.setName("New Product"); req.setSku("SKU-NEW");
        req.setPrice(new BigDecimal("150.00")); req.setStockQuantity(20);
        req.setCategoryId(1L);

        when(productRepository.existsBySku("SKU-NEW")).thenReturn(false);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(productRepository.save(any())).thenReturn(sampleProduct);

        ProductResponse res = productService.create(req);
        assertThat(res).isNotNull();
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void create_duplicateSku_throwsDuplicate() {
        ProductRequest req = new ProductRequest();
        req.setName("X"); req.setSku("SKU-001");
        req.setPrice(BigDecimal.TEN); req.setStockQuantity(5);

        when(productRepository.existsBySku("SKU-001")).thenReturn(true);
        assertThatThrownBy(() -> productService.create(req))
                .isInstanceOf(DuplicateResourceException.class);
    }

    @Test
    void delete_existingId_deletesSuccessfully() {
        when(productRepository.existsById(1L)).thenReturn(true);
        productService.delete(1L);
        verify(productRepository).deleteById(1L);
    }

    @Test
    void getLowStock_returnsProductsBelowThreshold() {
        when(productRepository.findLowStockProducts(10)).thenReturn(List.of(sampleProduct));
        List<ProductResponse> result = productService.getLowStock(10);
        assertThat(result).hasSize(1);
    }
}
