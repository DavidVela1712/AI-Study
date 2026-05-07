package com.app.aistudy.service;

import com.app.aistudy.model.User;
import com.app.aistudy.resources.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository repository;

    @Override
    public User login(User user) {
        System.out.println("Usuario recibido en login: "+ user);

        if (user.getEmail() == null || user.getPasswordHash() == null){
            throw new RuntimeException("Correo o contraseña vacío");
        }

        User userDB = repository.findUserByEmail(user.getEmail());
        System.out.println("Usuario encontrado: "+ userDB);

        if (userDB == null){
            throw new RuntimeException("Usuario no encontrado");
        }

        if (!user.getPasswordHash().equals(userDB.getPasswordHash())){
            throw new RuntimeException("Contraseña incorrecta");
        }
        return userDB;
    }

    @Override
    public List<User> findAll() {
        return repository.findAll();
    }

    @Override
    public boolean addUser(User user) {
        try {
            repository.save(user);
            return true;
        } catch (Exception e){
            System.out.println(e.toString());
            return false;
        }
    }

    @Override
    public User createUser(User user) {
        System.out.println(user.toString());

        if (user.getPasswordHash() == null || user.getEmail() == null){
            throw new RuntimeException("Correo o contraseña no pueden ser null");
        }
        return repository.save(user);
    }
}
