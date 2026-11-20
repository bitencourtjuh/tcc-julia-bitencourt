package com.client.ocr_client.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.client.ocr_client.dto.LoginRequest;
import com.client.ocr_client.dto.LoginResponse;
import com.client.ocr_client.dto.UsuarioResponse;
import com.client.ocr_client.entity.Usuario;
import com.client.ocr_client.repository.UsuarioRepository;
import com.client.ocr_client.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UsuarioRepository repository;

    public AuthController(
            AuthService authservice,
            UsuarioRepository repository) {
        this.authService = authservice;
        this.repository = repository;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    public UsuarioResponse me(@AuthenticationPrincipal Jwt jwt) {
        long id = Long.parseLong(jwt.getSubject());

        Usuario usuario = repository.findById(id)
                .filter(Usuario::isAtivo)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Usuário indisponível")
                );

        return UsuarioResponse.from(usuario);
    }
}
