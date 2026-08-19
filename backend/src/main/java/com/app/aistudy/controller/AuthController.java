package com.app.aistudy.controller;

import com.app.aistudy.dto.LoginRequestDTO;
import com.app.aistudy.dto.LoginResponseDTO;
import com.app.aistudy.dto.UserDTO;
import com.app.aistudy.dto.UserResponseDTO;
import com.app.aistudy.model.User;
import com.app.aistudy.security.JwtUtil;
import com.app.aistudy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody UserDTO userDTO) {
        try {
            UserResponseDTO user = userService.createUser(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            User user = new User();
            user.setEmail(loginRequest.getEmail());
            user.setPassword(loginRequest.getPassword());
            
            User authenticatedUser = userService.login(user);
            
            String token = jwtUtil.generateToken(authenticatedUser.getIdUser(), authenticatedUser.getEmail());
            
            LoginResponseDTO response = new LoginResponseDTO();
            response.setToken(token);
            response.setUser(userService.convertToResponseDTO(authenticatedUser));
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
