package com.smartlogix.auth.controller;

import com.smartlogix.auth.dto.RegisterRequest;
import com.smartlogix.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request){

        authService.register(request);

        return ResponseEntity.ok("Usuario registrado correctamente");
    }
}