package com.client.ocr_client.config;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.client.ocr_client.entity.PapelUsuario;
import com.client.ocr_client.entity.Usuario;
import com.client.ocr_client.repository.UsuarioRepository;

@Configuration
public class AdminBootstrap {

    @Bean
    @ConditionalOnProperty(
            name = "app.bootstrap-admin.enabled",
            havingValue = "true"
    )
    public ApplicationRunner criarAdministradorInicial(
            UsuarioRepository repository,
            PasswordEncoder passwordEncoder,
            @Value("${app.bootstrap-admin.email}") String email,
            @Value("${app.bootstrap-admin.password}") String senha
    ) {
        return args -> {
            String emailNormalizado
                    = email.trim().toLowerCase(Locale.ROOT);

            if (emailNormalizado.isBlank()
                    || senha == null
                    || senha.length() < 12) {
                throw new IllegalStateException(
                        "Credenciais iniciais inválidas."
                );
            }

            if (repository.existsByEmailIgnoreCase(
                    emailNormalizado
            )) {
                return;
            }

            Usuario usuario = new Usuario();

            usuario.setNome("Administrador");
            usuario.setEmail(emailNormalizado);
            usuario.setSenhaHash(
                    passwordEncoder.encode(senha)
            );
            usuario.setPapel(PapelUsuario.ADMIN);
            usuario.setAtivo(true);

            repository.save(usuario);
        };
    }
}
