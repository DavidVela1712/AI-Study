package com.app.aistudy.service;

import com.app.aistudy.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    public User login(User user);

    public List<User> findAll();

    public User findUser(Integer id);

    public User updateUser(Integer id, User newDataUser);

    public boolean addUser(User user);

    public User createUser(User user);

    public void deleteUser(Integer id);
}
