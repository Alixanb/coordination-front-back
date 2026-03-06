package com.example.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.demo.entity.Category;
import com.example.demo.entity.Note;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.NoteRepository;
import com.example.demo.repository.RoleRepository;
import com.example.demo.service.UserService;

@Component
public class UserInitializator implements CommandLineRunner {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final NoteRepository noteRepository;
    private final CategoryRepository categoryRepository;

    public UserInitializator(UserService userService, RoleRepository roleRepository, NoteRepository noteRepository, CategoryRepository categoryRepository) {
        this.userService = userService;
        this.roleRepository = roleRepository;
        this.noteRepository = noteRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        Role adminRole = roleRepository.findByName("ADMIN");
        if (adminRole == null) {
            adminRole = new Role("ADMIN");
            roleRepository.save(adminRole);
        }

        Role userRole = roleRepository.findByName("USER");
        if (userRole == null) {
            userRole = new Role("USER");
            roleRepository.save(userRole);
        }

        try {
            userService.loadUserByUsername("admin");
        } catch (Exception e) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("password");
            admin.getRoles().add(adminRole);
            userService.saveUser(admin);
        }

        try {
            userService.loadUserByUsername("user");
        } catch (Exception e) {
            User user = new User();
            user.setUsername("user");
            user.setPassword("password");
            user.getRoles().add(userRole);
            userService.saveUser(user);
        }

        // Seed Categories
        Category workCategory = categoryRepository.findByName("Work");
        if (workCategory == null) {
            workCategory = new Category();
            workCategory.setName("Work");
            categoryRepository.save(workCategory);
        }

        Category personalCategory = categoryRepository.findByName("Personal");
        if (personalCategory == null) {
            personalCategory = new Category();
            personalCategory.setName("Personal");
            categoryRepository.save(personalCategory);
        }

        // Seed Notes
        if (noteRepository.count() == 0) {
            Note note1 = new Note();
            note1.setTitle("Meeting Notes");
            note1.setContent("Discuss project roadmap and milestones.");
            note1.setCategory(workCategory);
            noteRepository.save(note1);

            Note note2 = new Note();
            note2.setTitle("Grocery List");
            note2.setContent("Milk, Eggs, Bread, Butter.");
            note2.setCategory(personalCategory);
            noteRepository.save(note2);

            Note note3 = new Note();
            note3.setTitle("Idea for App");
            note3.setContent("An app that tracks time travel paradoxes.");
            note3.setCategory(workCategory);
            noteRepository.save(note3);
        }
    }
}
