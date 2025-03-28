package com.kkovacstech.lagerverwaltung.repository;

import com.kkovacstech.lagerverwaltung.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByBenutzername(String benutzername);
}
