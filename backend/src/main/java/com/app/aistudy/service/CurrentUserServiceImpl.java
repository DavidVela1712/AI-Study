package com.app.aistudy.service;

import com.app.aistudy.model.User;
import com.app.aistudy.resources.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserServiceImpl implements CurrentUserService {

    @Value("${app.dev.user-id}")
    private Integer devUserId;

    @Autowired
    private UserRepository userRepository;

    @Override
    public User getCurrentUser() {
        return userRepository.findById(devUserId)
                .orElseThrow(() -> new RuntimeException("Usuario de desarrollo no encontrado"));
    }
}
