package com.app.aistudy.service;

import com.app.aistudy.dto.UserDTO;
import com.app.aistudy.dto.UserResponseDTO;
import com.app.aistudy.model.User;
import com.app.aistudy.resources.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository repository;

    @Override
    public UserResponseDTO convertToResponseDTO(User user) {
        UserResponseDTO savedUser = new UserResponseDTO();
        savedUser.setIdUser(user.getIdUser());
        savedUser.setEmail(user.getEmail());
        savedUser.setName(user.getName());
        return savedUser;
    }

    @Override
    public User login(User user) {
        System.out.println("Usuario recibido en login: "+ user);

        if (user.getEmail() == null || user.getPassword() == null){
            throw new RuntimeException("Correo o contraseña vacío");
        }

        User userDB = repository.findUserByEmail(user.getEmail());
        System.out.println("Usuario encontrado: "+ userDB);

        if (userDB == null){
            throw new RuntimeException("Usuario no encontrado");
        }

        if (!user.getPassword().equals(userDB.getPassword())){
            throw new RuntimeException("Contraseña incorrecta");
        }
        return userDB;
    }

    @Override
    public List<UserResponseDTO> findAll() {
        List<UserResponseDTO> usersDTO = new ArrayList<>();
        List<User> users = repository.findAll();
        for (User user : users){
            usersDTO.add(convertToResponseDTO(user));
        }
        return usersDTO;
    }
    @Override
    public UserResponseDTO findUser(Integer id) {
        User user = repository.findById(id)
                .orElseThrow( () -> new RuntimeException("Usario no encontrado"));
        return convertToResponseDTO(user);
    }

    @Override
    public UserResponseDTO updateUser(Integer id, UserDTO newDataUser) {
        User user = repository.findById(id)
                .orElseThrow( () -> new RuntimeException("Usario no encontrado"));
        if (newDataUser.getName()!=null){
            user.setName(newDataUser.getName());
        }
        if (newDataUser.getEmail()!=null) {
            user.setEmail(newDataUser.getEmail());
        }
        if (newDataUser.getPassword()!=null) {
            user.setPassword(newDataUser.getPassword());
        }
        return convertToResponseDTO(repository.save(user));
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
    public UserResponseDTO createUser(UserDTO user) {
        System.out.println(user.toString());

        if (user.getPassword() == null || user.getEmail() == null){
            throw new RuntimeException("Correo o contraseña no pueden ser null");
        }
        User newUser = new User();
        newUser.setName(user.getName());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(user.getPassword());
        newUser.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        return convertToResponseDTO(repository.save(newUser));
    }

    @Override
    public void deleteUser(Integer id) {
        User user = repository.findById(id)
                .orElseThrow( () -> new RuntimeException("Usario no encontrado"));
        repository.delete(user);
    }
}
