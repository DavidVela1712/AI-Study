package com.app.aistudy.service;

import com.app.aistudy.model.User;

import java.util.List;

public interface UserService {

    public User login(User user);

    public List<User> findAll();

    public boolean addUser(User user);

    public User createUser(User user);
}
