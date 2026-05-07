package com.app.aistudy.controller;

import com.app.aistudy.model.User;
import com.app.aistudy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> listUsers () {
        return userService.findAll();
    }

    @PostMapping
    public User createUser (@RequestBody User user){
        return userService.createUser(user);
    }
}
