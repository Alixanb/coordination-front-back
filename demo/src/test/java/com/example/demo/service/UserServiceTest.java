package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

class UserServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    private final UserService userService = new UserService(userRepository, passwordEncoder);

    @Test
    void testSaveUser() {
        User user = new User();
        user.setUsername("newuser");
        user.setPassword("rawPassword");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setUsername("newuser");
        savedUser.setPassword("encodedPassword");

        when(passwordEncoder.encode("rawPassword")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        User result = userService.saveUser(user);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("newuser", result.getUsername());
        verify(passwordEncoder).encode("rawPassword");
        verify(userRepository).save(user);
    }

    @Test
    void testLoadUserByUsername_Success() {

        User mockUser = new User();
        mockUser.setUsername("testUser");
        mockUser.setPassword("encodedPassword");
        Role role = new Role();
        role.setId(1L);
        role.setName("USER");
        mockUser.setRoles(Set.of(role));

        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(mockUser));

        UserDetails result = userService.loadUserByUsername("testUser");

        assertNotNull(result);
        assertEquals("testUser", result.getUsername());
        assertEquals("encodedPassword", result.getPassword());
        assertEquals(1, result.getAuthorities().size());
        assertEquals("ROLE_USER", result.getAuthorities().iterator().next().getAuthority());
        
        verify(userRepository).findByUsername("testUser");
    }

    @Test
    void testLoadUserByUsername_NotFound() {

        when(userRepository.findByUsername("unknownUser")).thenReturn(Optional.empty());

        UsernameNotFoundException exception = assertThrows(UsernameNotFoundException.class, () -> {
            userService.loadUserByUsername("unknownUser");
        });

        assertEquals("unknownUser not found", exception.getMessage());
        verify(userRepository).findByUsername("unknownUser");
    }
}
