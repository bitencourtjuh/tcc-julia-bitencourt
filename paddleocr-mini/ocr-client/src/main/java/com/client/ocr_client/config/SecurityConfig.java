package com.client.ocr_client.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/login"
                        ).permitAll()
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/documentos/confirmar"
                        ).hasAnyAuthority(
                                "ROLE_ADMIN",
                                "ROLE_TABELIAO"
                        )
                        .requestMatchers(
                                HttpMethod.POST,
                                "/documents/ocr"
                        ).hasAnyAuthority(
                                "ROLE_ADMIN",
                                "ROLE_TABELIAO",
                                "ROLE_ESCREVENTE"
                        )
                        .requestMatchers("/api/**")
                        .authenticated()
                        .anyRequest().denyAll()
                )
                .oauth2ResourceServer(oauth -> oauth
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(
                                jwtAuthenticationConverter()
                        ))
                );

        return http.build();
    }

    @Bean
    public Converter<Jwt, AbstractAuthenticationToken>
            jwtAuthenticationConverter() {

        return jwt -> {
            String papel = jwt.getClaimAsString("role");

            var autoridades = papel == null
                    ? List.<SimpleGrantedAuthority>of()
                    : List.of(
                            new SimpleGrantedAuthority("ROLE_" + papel)
                    );

            return new JwtAuthenticationToken(
                    jwt,
                    autoridades,
                    jwt.getSubject()
            );
        };
    }
}
