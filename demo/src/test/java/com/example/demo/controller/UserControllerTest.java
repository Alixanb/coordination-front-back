package com.example.demo.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import com.example.demo.service.TokenService;

class UserControllerTest {

    @Test
    void testToken() {
        TokenService tokenService = mock(TokenService.class);
        UserController userController = new UserController(tokenService);

        Authentication authentication = new UsernamePasswordAuthenticationToken("admin", "password");

        when(tokenService.generateToken(authentication)).thenReturn("fake-jwt-token");

        String result = userController.token(authentication);

        assertEquals("fake-jwt-token", result);
        verify(tokenService).generateToken(authentication);
    }
}
