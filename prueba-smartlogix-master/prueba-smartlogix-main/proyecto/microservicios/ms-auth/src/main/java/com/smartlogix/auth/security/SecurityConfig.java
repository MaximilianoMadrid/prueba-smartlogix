package com.smartlogix.auth.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Deshabilitamos CSRF porque para APIs REST con tokens JWT no se necesita
            .csrf(AbstractHttpConfigurer::disable)
            // Las APIs con JWT no manejan sesión de servidor
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Configuramos los permisos de las rutas
            .authorizeHttpRequests(auth -> auth
                // Dejamos libre el acceso a cualquier ruta (register, login, etc.)
                .requestMatchers(
                "/api/auth/**",
                "/error",
                "/swagger-ui/**"
                ,"/swagger-ui.html",
                "/v3/api-docs/**").permitAll()
                // Cualquier otra petición en la aplicación pedirá estar autenticado
                .anyRequest().authenticated()
            )
            // Registramos el filtro JWT ANTES del filtro de autenticación por usuario/contraseña.
            // Sin esta línea, JwtFilter nunca participa en la cadena de Spring Security.
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}