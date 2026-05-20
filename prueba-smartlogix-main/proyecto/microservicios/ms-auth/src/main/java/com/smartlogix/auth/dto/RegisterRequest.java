package com.smartlogix.auth.dto;

public record RegisterRequest(
        String nombre,
        String email,
        String contraseña
) {
}