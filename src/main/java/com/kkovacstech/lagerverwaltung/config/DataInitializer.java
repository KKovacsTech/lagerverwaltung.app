package com.kkovacstech.lagerverwaltung.config;

import com.kkovacstech.lagerverwaltung.model.User;
import com.kkovacstech.lagerverwaltung.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository) {
        return args -> {
            if (userRepository.findAll().isEmpty()) {
                User admin = new User();
                admin.setBenutzername("admin");
                admin.setPasswort("admin");
                admin.setRolle("admin");

                User user = new User();
                user.setBenutzername("benutzer");
                user.setPasswort("pass123");
                user.setRolle("user");

                userRepository.save(admin);
                userRepository.save(user);

                System.out.println("✅ Standard-Benutzer wurden erstellt.");
            }
        };
    }
}

