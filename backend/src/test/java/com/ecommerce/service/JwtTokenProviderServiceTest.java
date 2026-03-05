package com.ecommerce.service;

import com.ecommerce.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtTokenProviderServiceTest {

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private JwtTokenProviderService jwtTokenProviderService;

    @Test
    void generateToken_DelegatesToJwtTokenProvider() {
        String username = "user";
        Long userId = 1L;
        when(jwtTokenProvider.generateToken(username, userId)).thenReturn("token-123");

        String token = jwtTokenProviderService.generateToken(username, userId);

        assertThat(token).isEqualTo("token-123");
        verify(jwtTokenProvider).generateToken(username, userId);
    }
}

