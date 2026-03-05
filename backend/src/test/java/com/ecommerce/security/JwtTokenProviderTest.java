package com.ecommerce.security;

import com.ecommerce.config.JwtProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private static final String SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private static final long EXPIRATION_MS = 86400000L;

    @BeforeEach
    void setUp() {
        JwtProperties props = new JwtProperties();
        props.setSecret(SECRET);
        props.setExpirationMs(EXPIRATION_MS);
        jwtTokenProvider = new JwtTokenProvider(props);
    }

    @Test
    void generateToken_WithUsernameAndUserId_ReturnsValidToken() {
        String token = jwtTokenProvider.generateToken("testuser", 1L);
        assertThat(token).isNotBlank();
        assertThat(jwtTokenProvider.getUsernameFromToken(token)).isEqualTo("testuser");
        assertThat(jwtTokenProvider.validateToken(token)).isTrue();
    }

    @Test
    void generateToken_WithAuthentication_ReturnsValidToken() {
        UserPrincipal principal = UserPrincipal.create(
                com.ecommerce.entity.User.builder().id(2L).username("admin").password("").role(com.ecommerce.entity.Role.ADMIN).build());
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        String token = jwtTokenProvider.generateToken(auth);
        assertThat(token).isNotBlank();
        assertThat(jwtTokenProvider.getUsernameFromToken(token)).isEqualTo("admin");
    }

    @Test
    void validateToken_WhenInvalid_ReturnsFalse() {
        assertThat(jwtTokenProvider.validateToken("invalid.token.here")).isFalse();
        assertThat(jwtTokenProvider.validateToken("")).isFalse();
    }
}
