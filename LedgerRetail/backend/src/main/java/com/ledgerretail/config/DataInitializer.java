package com.ledgerretail.config;

import com.ledgerretail.entity.*;
import com.ledgerretail.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository     userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository  productRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder    passwordEncoder;

    @Override
    public void run(String... args) {
        seedUsers();
        seedCategories();
        seedProducts();
        seedCustomers();
        log.info("Data initialization complete");
    }

    private void seedUsers() {
        if (userRepository.existsByEmail("admin@ledger.com")) return;
        userRepository.save(User.builder().name("Alex Sterling").email("admin@ledger.com")
                .password(passwordEncoder.encode("admin123")).role(User.Role.ADMIN).build());
        userRepository.save(User.builder().name("Jamie Cashier").email("cashier@ledger.com")
                .password(passwordEncoder.encode("cash123")).role(User.Role.CASHIER).build());
        log.info("Default users created");
    }

    private void seedCategories() {
        String[] cats = {"Electronics","Audio","Accessories","Photography",
                         "Furniture","Clothing","Mobile Phones","Home Appliances",
                         "Sports & Fitness","Books & Stationery"};
        for (String name : cats)
            if (!categoryRepository.existsByNameIgnoreCase(name))
                categoryRepository.save(Category.builder().name(name).build());
        log.info("Categories seeded");
    }

    private void seedProducts() {
        if (productRepository.count() > 0) return;
        var electronics = categoryRepository.findByNameIgnoreCase("Electronics").orElseThrow();
        var audio       = categoryRepository.findByNameIgnoreCase("Audio").orElseThrow();
        var accessories = categoryRepository.findByNameIgnoreCase("Accessories").orElseThrow();
        var photography = categoryRepository.findByNameIgnoreCase("Photography").orElseThrow();
        var mobiles     = categoryRepository.findByNameIgnoreCase("Mobile Phones").orElseThrow();
        var sports      = categoryRepository.findByNameIgnoreCase("Sports & Fitness").orElseThrow();
        var books       = categoryRepository.findByNameIgnoreCase("Books & Stationery").orElseThrow();

        // All prices in Indian Rupees (INR)
        productRepository.save(Product.builder().name("Lenovo IdeaPad 5 Laptop").sku("LEN-IP5-001")
                .price(new BigDecimal("58999.00")).stockQuantity(25).category(electronics)
                .description("15.6 FHD IPS, AMD Ryzen 5, 8GB RAM, 512GB SSD").build());
        productRepository.save(Product.builder().name("Dell XPS 13 Ultrabook").sku("DEL-XPS-042")
                .price(new BigDecimal("124999.00")).stockQuantity(8).category(electronics)
                .description("13.3 OLED, Intel Core i7, 16GB RAM, 1TB SSD").build());
        productRepository.save(Product.builder().name("Samsung 27 4K Monitor").sku("SAM-MON-27K")
                .price(new BigDecimal("28999.00")).stockQuantity(40).category(electronics)
                .description("27 IPS 4K UHD, 60Hz, USB-C, HDR10").build());
        productRepository.save(Product.builder().name("Sony WH-1000XM5 Headphones").sku("SNY-WH1000XM5")
                .price(new BigDecimal("26990.00")).stockQuantity(35).category(audio)
                .description("Industry-leading noise cancellation, 30h battery").build());
        productRepository.save(Product.builder().name("boAt Rockerz 550").sku("BOA-ROC-550")
                .price(new BigDecimal("1799.00")).stockQuantity(120).category(audio)
                .description("Wireless Bluetooth headphones, 20h battery, 40mm drivers").build());
        productRepository.save(Product.builder().name("JBL Charge 5 Speaker").sku("JBL-CHG-5")
                .price(new BigDecimal("13999.00")).stockQuantity(55).category(audio)
                .description("Portable Bluetooth speaker, IP67 waterproof, 20h playtime").build());
        productRepository.save(Product.builder().name("Logitech MX Master 3S Mouse").sku("LGT-MXM-3S")
                .price(new BigDecimal("8295.00")).stockQuantity(80).category(accessories)
                .description("Ergonomic wireless mouse, 8000 DPI, USB-C charging").build());
        productRepository.save(Product.builder().name("Keychron K2 Mechanical Keyboard").sku("KEY-K2-V2")
                .price(new BigDecimal("7999.00")).stockQuantity(45).category(accessories)
                .description("Wireless TKL, Gateron Brown switches, RGB backlight").build());
        productRepository.save(Product.builder().name("Zebronics USB-C Hub 7-in-1").sku("ZEB-HUB-7IN1")
                .price(new BigDecimal("1999.00")).stockQuantity(90).category(accessories)
                .description("HDMI 4K, 3xUSB-A 3.0, SD/TF card reader, 100W PD").build());
        productRepository.save(Product.builder().name("Canon EOS 1500D DSLR").sku("CAN-EOS-1500D")
                .price(new BigDecimal("34999.00")).stockQuantity(12).category(photography)
                .description("24.1MP APS-C sensor, Full HD video, 18-55mm kit lens").build());
        productRepository.save(Product.builder().name("SanDisk Extreme 128GB SD Card").sku("SND-EXT-128")
                .price(new BigDecimal("1899.00")).stockQuantity(0).category(photography)
                .description("UHS-I U3, V30, up to 160MB/s read speed").build());
        productRepository.save(Product.builder().name("iPhone 15").sku("APL-IP15-128")
                .price(new BigDecimal("79900.00")).stockQuantity(20).category(mobiles)
                .description("A16 Bionic, 48MP main camera, Dynamic Island, USB-C").build());
        productRepository.save(Product.builder().name("Redmi Note 13 Pro+").sku("XMI-N13PP")
                .price(new BigDecimal("31999.00")).stockQuantity(45).category(mobiles)
                .description("200MP camera, 5000mAh, 120W HyperCharge, 6.67 AMOLED").build());
        productRepository.save(Product.builder().name("Samsung Galaxy M34 5G").sku("SAM-M34-5G")
                .price(new BigDecimal("18999.00")).stockQuantity(60).category(mobiles)
                .description("6.5 sAMOLED, 50MP camera, 6000mAh, 25W charging").build());
        productRepository.save(Product.builder().name("Boldfit Dumbbell Set 20kg").sku("BLF-DBL-20KG")
                .price(new BigDecimal("3499.00")).stockQuantity(35).category(sports)
                .description("Adjustable 20kg pair, chrome plated, with storage stand").build());
        productRepository.save(Product.builder().name("Decathlon Yoga Mat 8mm").sku("DCA-YGA-8MM")
                .price(new BigDecimal("999.00")).stockQuantity(100).category(sports)
                .description("8mm thick, non-slip surface, 183x61cm").build());
        productRepository.save(Product.builder().name("Clean Code - Robert C. Martin").sku("BK-CLEANCODE")
                .price(new BigDecimal("699.00")).stockQuantity(40).category(books)
                .description("A Handbook of Agile Software Craftsmanship").build());
        productRepository.save(Product.builder().name("System Design Interview Vol 2").sku("BK-SDI-VOL2")
                .price(new BigDecimal("849.00")).stockQuantity(30).category(books)
                .description("An Insider Guide by Alex Xu and Sahn Lam").build());

        log.info("Products seeded with INR pricing");
    }

    private void seedCustomers() {
        if (customerRepository.count() > 0) return;
        customerRepository.save(Customer.builder().name("Arjun Mehta").email("arjun.mehta@techcorp.in")
                .phone("+91 98765 43210").company("TechCorp India Pvt Ltd")
                .address("42, MG Road, Bengaluru, Karnataka 560001").status(Customer.Status.ENTERPRISE).build());
        customerRepository.save(Customer.builder().name("Priya Sharma").email("priya.sharma@startup.io")
                .phone("+91 87654 32109").company("StartUp.io")
                .address("Flat 5B, Hiranandani Estate, Thane, Maharashtra 400607").status(Customer.Status.ACTIVE).build());
        customerRepository.save(Customer.builder().name("Ravi Kiran").email("ravi.kiran@bizhouse.com")
                .phone("+91 76543 21098").company("BizHouse Solutions")
                .address("12, Connaught Place, New Delhi 110001").status(Customer.Status.DELINQUENT).build());
        customerRepository.save(Customer.builder().name("Sneha Patel").email("sneha.p@globallogistics.in")
                .phone("+91 65432 10987").company("Global Logistics India")
                .address("Plot 9, GIDC Industrial Area, Surat, Gujarat 395010").status(Customer.Status.ENTERPRISE).build());
        customerRepository.save(Customer.builder().name("Vikram Nair").email("vikram.nair@freelance.dev")
                .phone("+91 54321 09876").address("88, Anna Salai, Chennai, Tamil Nadu 600002").status(Customer.Status.ACTIVE).build());
        customerRepository.save(Customer.builder().name("Anjali Gupta").email("anjali.g@retail24.com")
                .phone("+91 43210 98765").company("Retail24 Enterprises")
                .address("101, Sector 18, Noida, Uttar Pradesh 201301").status(Customer.Status.ACTIVE).build());
        log.info("Indian customers seeded");
    }
}
