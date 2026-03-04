package com.ecommerce.service;

import com.ecommerce.dto.AuthResponse;
import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProviderService jwtTokenProviderService;

    @Mock
    private CartService cartService;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_WhenValid_CreatesUserAndReturnsToken() {
        RegisterRequest request = new RegisterRequest("newuser", "new@mail.com", "password123");
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("new@mail.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(1L);
            return u;
        });
        when(jwtTokenProviderService.generateToken(any(), any())).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        assertThat(response).isNotNull();
        assertThat(response.getUsername()).isEqualTo("newuser");
        assertThat(response.getRole()).isEqualTo(Role.CLIENT);
        assertThat(response.getToken()).isEqualTo("jwt-token");
        verify(cartService).createCartForUser(any(User.class));
    }

    @Test
    void register_WhenUsernameExists_Throws() {
        RegisterRequest request = new RegisterRequest("existing", "e@mail.com", "pass");
        when(userRepository.existsByUsername("existing")).thenReturn(true);
        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Username already exists");
    }

    @Test
    void login_WhenValid_ReturnsToken() {
        User user = User.builder().id(1L).username("user").password("hash").role(Role.CLIENT).build();
        LoginRequest request = new LoginRequest("user", "pass");
        Authentication auth = new UsernamePasswordAuthenticationToken(
                com.ecommerce.security.UserPrincipal.create(user), null, java.util.List.of());
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(user));
        when(jwtTokenProviderService.generateToken("user", 1L)).thenReturn("token");

        AuthResponse response = authService.login(request);

        assertThat(response.getToken()).isEqualTo("token");
        assertThat(response.getUsername()).isEqualTo("user");
    }
}
