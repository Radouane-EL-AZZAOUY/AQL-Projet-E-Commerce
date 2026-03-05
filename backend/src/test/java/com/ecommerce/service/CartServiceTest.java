package com.ecommerce.service;

import com.ecommerce.entity.Cart;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private CartService cartService;

    private User user;
    private Cart cart;
    private Product product;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).username("user1").role(com.ecommerce.entity.Role.CLIENT).build();
        cart = Cart.builder().id(1L).user(user).items(new ArrayList<>()).build();
        product = Product.builder()
                .id(10L)
                .name("Prod")
                .price(BigDecimal.valueOf(19.99))
                .stock(100)
                .deleted(false)
                .build();
    }

    @Test
    void addItem_WhenItemNotInCart_AddsNewItem() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);
        var result = cartService.addItem(1L, 10L, 2);
        assertThat(result).isNotNull();
        assertThat(result.getItems()).hasSize(1);
        assertThat(result.getItems().get(0).getQuantity()).isEqualTo(2);
    }

    @Test
    void addItem_WhenInsufficientStock_Throws() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        product.setStock(1);
        assertThatThrownBy(() -> cartService.addItem(1L, 10L, 5))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Insufficient stock");
    }

    @Test
    void addItem_WhenProductDeleted_Throws() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        product.setDeleted(true);
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        assertThatThrownBy(() -> cartService.addItem(1L, 10L, 1))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not available");
    }

    @Test
    void getCartByUserId_WhenCartNotFound_Throws() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> cartService.getCartByUserId(1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Cart not found");
    }

    @Test
    void getCartByUserId_WhenFound_ReturnsDto() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        var result = cartService.getCartByUserId(1L);
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void createCartForUser_WhenNoCart_CreatesNew() {
        when(cartRepository.findByUser(user)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenAnswer(i -> {
            Cart c = i.getArgument(0);
            c.setId(2L);
            return c;
        });
        Cart result = cartService.createCartForUser(user);
        assertThat(result.getId()).isEqualTo(2L);
        verify(cartRepository).save(any(Cart.class));
    }

    @Test
    void createCartForUser_WhenCartExists_ReturnsExisting() {
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        Cart result = cartService.createCartForUser(user);
        assertThat(result).isEqualTo(cart);
        verify(cartRepository, never()).save(any(Cart.class));
    }

    @Test
    void addItem_WhenQuantityLessThanOne_Throws() {
        assertThatThrownBy(() -> cartService.addItem(1L, 10L, 0))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("at least 1");
    }

    @Test
    void addItem_WhenCartNotFound_Throws() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> cartService.addItem(1L, 10L, 1))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Cart not found");
    }

    @Test
    void addItem_WhenProductNotFound_Throws() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(999L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> cartService.addItem(1L, 999L, 1))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Product not found");
    }

    @Test
    void addItem_WhenItemAlreadyInCart_AddsQuantity() {
        CartItem existingItem = CartItem.builder().cart(cart).product(product).quantity(1).build();
        cart.getItems().add(existingItem);
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);
        var result = cartService.addItem(1L, 10L, 2);
        assertThat(result.getItems().get(0).getQuantity()).isEqualTo(3);
    }

    @Test
    void addItem_WhenItemInCartAndInsufficientStock_Throws() {
        CartItem existingItem = CartItem.builder().cart(cart).product(product).quantity(1).build();
        cart.getItems().add(existingItem);
        product.setStock(2);
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        assertThatThrownBy(() -> cartService.addItem(1L, 10L, 5))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Insufficient stock");
    }

    @Test
    void updateItemQuantity_WhenValid_UpdatesQuantity() {
        CartItem item = CartItem.builder().cart(cart).product(product).quantity(2).build();
        cart.getItems().add(item);
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);
        var result = cartService.updateItemQuantity(1L, 10L, 5);
        assertThat(result.getItems().get(0).getQuantity()).isEqualTo(5);
    }

    @Test
    void updateItemQuantity_WhenQuantityZero_RemovesItem() {
        CartItem item = CartItem.builder().cart(cart).product(product).quantity(1).build();
        cart.getItems().add(item);
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);
        var result = cartService.updateItemQuantity(1L, 10L, 0);
        verify(cartRepository).save(cart);
    }

    @Test
    void updateItemQuantity_WhenItemNotInCart_Throws() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        assertThatThrownBy(() -> cartService.updateItemQuantity(1L, 10L, 1))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Item not in cart");
    }

    @Test
    void updateItemQuantity_WhenProductDeleted_Throws() {
        CartItem item = CartItem.builder().cart(cart).product(product).quantity(1).build();
        cart.getItems().add(item);
        product.setDeleted(true);
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        assertThatThrownBy(() -> cartService.updateItemQuantity(1L, 10L, 1))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not available");
    }

    @Test
    void updateItemQuantity_WhenInsufficientStock_Throws() {
        CartItem item = CartItem.builder().cart(cart).product(product).quantity(1).build();
        cart.getItems().add(item);
        product.setStock(1);
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(productRepository.findById(10L)).thenReturn(Optional.of(product));
        assertThatThrownBy(() -> cartService.updateItemQuantity(1L, 10L, 5))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Insufficient stock");
    }

    @Test
    void removeItem_RemovesFromCart() {
        CartItem item = CartItem.builder().cart(cart).product(product).quantity(1).build();
        cart.getItems().add(item);
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);
        var result = cartService.removeItem(1L, 10L);
        verify(cartRepository).save(cart);
    }

    @Test
    void clearCart_ClearsItems() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        cartService.clearCart(1L);
        verify(cartRepository).save(cart);
    }

    @Test
    void clearCart_WhenCartNotFound_Throws() {
        when(cartRepository.findByUserId(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> cartService.clearCart(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Cart not found");
    }
}
