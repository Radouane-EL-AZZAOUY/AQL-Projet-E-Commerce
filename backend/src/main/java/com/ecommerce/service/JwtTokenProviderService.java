package com.ecommerce.service;

import com.ecommerce.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtTokenProviderService {

    private final JwtTokenProvider jwtTokenProvider;

    public String generateToken(String username, Long userId) {
        return jwtTokenProvider.generateToken(username, userId);
    }
}
