package com.ecommerce.service;

import com.ecommerce.dto.*;
import com.ecommerce.entity.*;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderDto createOrder(Long userId, OrderCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }
        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .createdAt(Instant.now())
                .build();
        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + itemReq.getProductId()));
            if (product.isDeleted()) {
                throw new IllegalArgumentException("Product not available: " + product.getId());
            }
            if (product.getStock() < itemReq.getQuantity()) {
                throw new IllegalArgumentException(
                        "Insufficient stock for product " + product.getName() + ". Available: " + product.getStock());
            }
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();
            order.getItems().add(orderItem);
        }
        order = orderRepository.save(order);
        return toDto(order);
    }

    @Transactional
    public OrderDto confirmOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        if (!order.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Order does not belong to user");
        }
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalArgumentException("Order cannot be modified. Status: " + order.getStatus());
        }
        for (OrderItem oi : order.getItems()) {
            Product p = oi.getProduct();
            if (p.getStock() < oi.getQuantity()) {
                throw new IllegalArgumentException(
                        "Insufficient stock for product " + p.getName() + ". Available: " + p.getStock());
            }
            p.setStock(p.getStock() - oi.getQuantity());
            productRepository.save(p);
        }
        order.setStatus(OrderStatus.CONFIRMED);
        order = orderRepository.save(order);
        return toDto(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        return orderRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long orderId, Long userId, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        if (!isAdmin && !order.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Order not found: " + orderId);
        }
        return toDto(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrdersAdmin() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        if (order.getStatus() == OrderStatus.CONFIRMED) {
            throw new IllegalArgumentException("A confirmed order cannot be changed");
        }
        if (status == OrderStatus.CONFIRMED) {
            for (OrderItem oi : order.getItems()) {
                Product p = oi.getProduct();
                if (p.getStock() < oi.getQuantity()) {
                    throw new IllegalArgumentException(
                            "Insufficient stock for product " + p.getName() + ". Available: " + p.getStock());
                }
                p.setStock(p.getStock() - oi.getQuantity());
                productRepository.save(p);
            }
        }
        order.setStatus(status);
        order = orderRepository.save(order);
        return toDto(order);
    }

    private OrderDto toDto(Order o) {
        List<OrderItemDto> items = o.getItems().stream()
                .map(oi -> OrderItemDto.builder()
                        .productId(oi.getProduct().getId())
                        .productName(oi.getProduct().getName())
                        .quantity(oi.getQuantity())
                        .unitPrice(oi.getUnitPrice())
                        .subtotal(oi.getSubtotal())
                        .build())
                .collect(Collectors.toList());
        return OrderDto.builder()
                .id(o.getId())
                .userId(o.getUser().getId())
                .username(o.getUser().getUsername())
                .status(o.getStatus())
                .createdAt(o.getCreatedAt())
                .items(items)
                .totalAmount(o.getTotalAmount())
                .build();
    }
}
