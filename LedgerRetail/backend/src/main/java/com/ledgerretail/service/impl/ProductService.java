package com.ledgerretail.service.impl;

import com.ledgerretail.dto.request.ProductRequest;
import com.ledgerretail.dto.response.ProductResponse;
import com.ledgerretail.entity.Category;
import com.ledgerretail.entity.Product;
import com.ledgerretail.exception.DuplicateResourceException;
import com.ledgerretail.exception.ResourceNotFoundException;
import com.ledgerretail.repository.CategoryRepository;
import com.ledgerretail.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository  productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public Page<ProductResponse> getAll(String search, Long categoryId, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());

        if (search != null && !search.isBlank())
            return productRepository.search(search, pageable).map(ProductResponse::from);
        if (categoryId != null)
            return productRepository.findByCategoryId(categoryId, pageable).map(ProductResponse::from);

        return productRepository.findAll(pageable).map(ProductResponse::from);
    }

    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        return ProductResponse.from(findOrThrow(id));
    }

    public ProductResponse create(ProductRequest req) {
        if (req.getSku() != null && productRepository.existsBySku(req.getSku()))
            throw new DuplicateResourceException("SKU already exists: " + req.getSku());

        Product product = Product.builder()
                .name(req.getName())
                .description(req.getDescription())
                .price(req.getPrice())
                .stockQuantity(req.getStockQuantity())
                .sku(req.getSku())
                .category(resolveCategory(req))
                .build();

        return ProductResponse.from(productRepository.save(product));
    }

    public ProductResponse update(Long id, ProductRequest req) {
        Product product = findOrThrow(id);

        if (req.getSku() != null && !req.getSku().equals(product.getSku())
                && productRepository.existsBySku(req.getSku()))
            throw new DuplicateResourceException("SKU already exists: " + req.getSku());

        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice());
        product.setStockQuantity(req.getStockQuantity());
        product.setSku(req.getSku());
        product.setCategory(resolveCategory(req));

        return ProductResponse.from(productRepository.save(product));
    }

    public void delete(Long id) {
        if (!productRepository.existsById(id))
            throw new ResourceNotFoundException("Product", id);
        productRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getLowStock(int threshold) {
        return productRepository.findLowStockProducts(threshold)
                .stream().map(ProductResponse::from).toList();
    }

    public Product findOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    private Category resolveCategory(ProductRequest req) {
        if (req.getCategoryId() != null)
            return categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", req.getCategoryId()));
        if (req.getCategoryName() != null && !req.getCategoryName().isBlank())
            return categoryRepository.findByNameIgnoreCase(req.getCategoryName())
                    .orElseGet(() -> categoryRepository.save(
                            Category.builder().name(req.getCategoryName()).build()));
        return null;
    }
}
