package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;

class TokenServiceTest {

    @Test
    void testGenerateToken() {
        JwtEncoder encoder = mock(JwtEncoder.class);
        TokenService tokenService = new TokenService(encoder);

        Map<String, Object> fakeMap = new HashMap<>();
        fakeMap.put("fake", "fake");

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                "testUser",
                "password",
                List.of(new SimpleGrantedAuthority("ROLE_USER")));

        Jwt jwt = new Jwt(
                "fake-jwt-value",
                Instant.now(),
                Instant.now().plusSeconds(3600),
                fakeMap,
                fakeMap);

        when(encoder.encode(any(JwtEncoderParameters.class))).thenReturn(jwt);

        String result = tokenService.generateToken(authentication);

        assertEquals("fake-jwt-value", result);
        verify(encoder).encode(any(JwtEncoderParameters.class));
    }
}
