package com.kkovacstech.lagerverwaltung.controller;

import com.kkovacstech.lagerverwaltung.model.User;
import com.kkovacstech.lagerverwaltung.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
@CrossOrigin
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public String login(@RequestBody User loginData) {
        User user = userRepository.findByBenutzername(loginData.getBenutzername());

        if (user != null && user.getPasswort().equals(loginData.getPasswort())) {
            return user.getRolle(); // "admin" oder "user"
        } else {
            return "unauthorized";
        }
    }
}
