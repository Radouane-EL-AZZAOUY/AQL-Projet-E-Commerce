package com.ecommerce.service;

import com.ecommerce.dto.OrderCreateRequest;
import com.ecommerce.dto.OrderDto;
import com.ecommerce.dto.OrderItemRequest;
import com.ecommerce.entity.*;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private OrderService orderService;

    private User user;
    private Product product;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).username("client").role(Role.CLIENT).build();
        product = Product.builder()
                .id(1L)
                .name("Product")
                .price(BigDecimal.valueOf(29.99))
                .stock(10)
                .deleted(false)
                .build();
    }

    @Test
    void createOrder_WhenValid_CreatesOrder() {
        OrderCreateRequest request = new OrderCreateRequest(
                List.of(new OrderItemRequest(1L, 2))
        );
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> {
            Order o = inv.getArgument(0);
            o.setId(100L);
            return o;
        });
        var result = orderService.createOrder(1L, request);
        assertThat(result).isNotNull();
        assertThat(result.getItems()).hasSize(1);
        assertThat(result.getStatus()).isEqualTo(OrderStatus.PENDING);
    }

    @Test
    void createOrder_WhenInsufficientStock_Throws() {
        product.setStock(1);
        OrderCreateRequest request = new OrderCreateRequest(
                List.of(new OrderItemRequest(1L, 5))
        );
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        assertThatThrownBy(() -> orderService.createOrder(1L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Insufficient stock");
    }

    @Test
    void createOrder_WhenProductDeleted_Throws() {
        product.setDeleted(true);
        OrderCreateRequest request = new OrderCreateRequest(
                List.of(new OrderItemRequest(1L, 1))
        );
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        assertThatThrownBy(() -> orderService.createOrder(1L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not available");
    }

    @Test
    void updateOrderStatus_WhenOrderConfirmed_CannotChange() {
        Order order = Order.builder().id(1L).status(OrderStatus.CONFIRMED).build();
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        assertThatThrownBy(() -> orderService.updateOrderStatus(1L, OrderStatus.CANCELLED))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("cannot be changed");
    }

    @Test
    void createOrder_WhenUserNotFound_Throws() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> orderService.createOrder(99L, new OrderCreateRequest(List.of(new OrderItemRequest(1L, 1)))))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    void createOrder_WhenEmptyItems_Throws() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        assertThatThrownBy(() -> orderService.createOrder(1L, new OrderCreateRequest(List.of())))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("at least one item");
    }

    @Test
    void createOrder_WhenNullItems_Throws() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        assertThatThrownBy(() -> orderService.createOrder(1L, new OrderCreateRequest(null)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("at least one item");
    }

    @Test
    void createOrder_WhenProductNotFound_Throws() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(productRepository.findById(999L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> orderService.createOrder(1L, new OrderCreateRequest(List.of(new OrderItemRequest(999L, 1)))))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Product not found");
    }

    @Test
    void confirmOrder_WhenValid_ConfirmsAndDecrementsStock() {
        OrderItem oi = OrderItem.builder().product(product).quantity(2).unitPrice(product.getPrice()).build();
        Order order = Order.builder().id(1L).user(user).status(OrderStatus.PENDING).items(new ArrayList<>(List.of(oi))).build();
        oi.setOrder(order);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        OrderDto result = orderService.confirmOrder(1L, 1L);
        assertThat(result.getStatus()).isEqualTo(OrderStatus.CONFIRMED);
    }

    @Test
    void confirmOrder_WhenOrderNotFound_Throws() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> orderService.confirmOrder(99L, 1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Order not found");
    }

    @Test
    void confirmOrder_WhenWrongUser_Throws() {
        Order order = Order.builder().id(1L).user(user).status(OrderStatus.PENDING).build();
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        assertThatThrownBy(() -> orderService.confirmOrder(1L, 999L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("does not belong");
    }

    @Test
    void confirmOrder_WhenNotPending_Throws() {
        Order order = Order.builder().id(1L).user(user).status(OrderStatus.CANCELLED).build();
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        assertThatThrownBy(() -> orderService.confirmOrder(1L, 1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("cannot be modified");
    }

    @Test
    void getOrdersByUserId_ReturnsList() {
        Order order = Order.builder().id(1L).user(user).status(OrderStatus.PENDING).createdAt(Instant.now()).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(orderRepository.findByUserOrderByCreatedAtDesc(user)).thenReturn(List.of(order));
        List<OrderDto> result = orderService.getOrdersByUserId(1L);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);
    }

    @Test
    void getOrdersByUserId_WhenUserNotFound_Throws() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> orderService.getOrdersByUserId(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    void getOrderById_WhenAdmin_ReturnsAnyOrder() {
        User other = User.builder().id(2L).username("other").build();
        Order order = Order.builder().id(1L).user(other).status(OrderStatus.PENDING).build();
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        OrderDto result = orderService.getOrderById(1L, 1L, true);
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void getOrderById_WhenNotAdminAndWrongUser_Throws() {
        User other = User.builder().id(2L).username("other").build();
        Order order = Order.builder().id(1L).user(other).status(OrderStatus.PENDING).build();
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        assertThatThrownBy(() -> orderService.getOrderById(1L, 1L, false))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Order not found");
    }

    @Test
    void getOrderById_WhenOrderNotFound_Throws() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> orderService.getOrderById(99L, 1L, false))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Order not found");
    }

    @Test
    void getAllOrdersAdmin_ReturnsAll() {
        Order order = Order.builder().id(1L).user(user).status(OrderStatus.PENDING).build();
        when(orderRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(order));
        List<OrderDto> result = orderService.getAllOrdersAdmin();
        assertThat(result).hasSize(1);
    }

    @Test
    void updateOrderStatus_WhenCancelled_SavesStatus() {
        Order order = Order.builder().id(1L).user(user).status(OrderStatus.PENDING).build();
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        OrderDto result = orderService.updateOrderStatus(1L, OrderStatus.CANCELLED);
        assertThat(result.getStatus()).isEqualTo(OrderStatus.CANCELLED);
    }

    @Test
    void updateOrderStatus_WhenOrderNotFound_Throws() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> orderService.updateOrderStatus(99L, OrderStatus.CANCELLED))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Order not found");
    }
}
