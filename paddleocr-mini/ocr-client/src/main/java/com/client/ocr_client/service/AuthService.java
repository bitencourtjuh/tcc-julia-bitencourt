package com.client.ocr_client.service;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.client.ocr_client.dto.LoginRequest;
import com.client.ocr_client.dto.LoginResponse;
import com.client.ocr_client.dto.UsuarioResponse;
import com.client.ocr_client.entity.Usuario;
import com.client.ocr_client.repository.UsuarioRepository;

@Service
public class AuthService {

    private static final long TOKEN_SECONDS = 1800;

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;

    public AuthService(
            UsuarioRepository repository,
            PasswordEncoder passwordEncoder,
            JwtEncoder jwtEncoder
    ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtEncoder = jwtEncoder;
    }

    public LoginResponse login(LoginRequest request) {
        if (request == null
                || request.email() == null
                || request.senha() == null) {
            throw credenciaisInvalidas();
        }

        String email = request.email();

        Usuario usuario = repository.findByEmailIgnoreCase(email)
                .orElseThrow(this::credenciaisInvalidas);

        if (!usuario.isAtivo() || !passwordEncoder.matches(
                request.senha(),
                usuario.getSenhaHash()
        )) {
            throw credenciaisInvalidas();
        }

        Instant agora = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("tcc-cartorio")
                .issuedAt(agora)
                .expiresAt(
                        agora.plusSeconds(TOKEN_SECONDS)
                )
                .subject(usuario.getId().toString())
                .claim("role", usuario.getPapel().name())
                .build();
        JwsHeader header = JwsHeader
                .with(MacAlgorithm.HS256)
                .build();
        String token = jwtEncoder.encode(
                JwtEncoderParameters.from(header, claims)
        ).getTokenValue();

        return new LoginResponse(
                token,
                "Bearer",
                String.valueOf(TOKEN_SECONDS),
                UsuarioResponse.from(usuario)
        );
    }

    private ResponseStatusException credenciaisInvalidas() {
        return new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Credenciais inválidas"
        );
    }
}
