package com.example.demo.config;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.example.demo.entity.Category;
import com.example.demo.entity.Note;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.NoteRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.service.UserService;

class UserInitializatorTest {

    private final UserService userService = mock(UserService.class);
    private final RoleRepository roleRepository = mock(RoleRepository.class);
    private final NoteRepository noteRepository = mock(NoteRepository.class);
    private final CategoryRepository categoryRepository = mock(CategoryRepository.class);

    private final UserInitializator initializator = new UserInitializator(
            userService, roleRepository, noteRepository, categoryRepository);

    /**
     * Base vierge : rôles, utilisateurs, catégories et notes doivent tous être créés.
     */
    @Test
    void seedsEverythingWhenDatabaseIsEmpty() throws Exception {
        when(roleRepository.findByName(anyString())).thenReturn(null);
        when(userService.loadUserByUsername(anyString()))
                .thenThrow(new UsernameNotFoundException("not found"));
        when(categoryRepository.findByName(anyString())).thenReturn(null);
        when(noteRepository.count()).thenReturn(0L);

        initializator.run();

        // 2 rôles (ADMIN, USER)
        verify(roleRepository, times(2)).save(any(Role.class));
        // 2 utilisateurs (admin, user)
        verify(userService, times(2)).saveUser(any(User.class));
        // 2 catégories (Work, Personal)
        verify(categoryRepository, times(2)).save(any(Category.class));
        // 3 notes d'exemple
        verify(noteRepository, times(3)).save(any(Note.class));
    }

    /**
     * Base déjà peuplée : le seed est idempotent, rien n'est recréé.
     */
    @Test
    void isIdempotentWhenDataAlreadyExists() throws Exception {
        when(roleRepository.findByName("ADMIN")).thenReturn(new Role("ADMIN"));
        when(roleRepository.findByName("USER")).thenReturn(new Role("USER"));
        when(userService.loadUserByUsername(anyString())).thenReturn(new User());
        when(categoryRepository.findByName("Work")).thenReturn(new Category());
        when(categoryRepository.findByName("Personal")).thenReturn(new Category());
        when(noteRepository.count()).thenReturn(3L);

        initializator.run();

        verify(roleRepository, never()).save(any(Role.class));
        verify(userService, never()).saveUser(any(User.class));
        verify(categoryRepository, never()).save(any(Category.class));
        verify(noteRepository, never()).save(any(Note.class));
    }
}
