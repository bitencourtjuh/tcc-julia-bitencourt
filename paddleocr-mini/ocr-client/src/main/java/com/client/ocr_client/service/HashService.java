package com.client.ocr_client.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

import org.springframework.stereotype.Service;

@Service
public class HashService {

    public String gerarHash(String conteudo) {
        try {
            MessageDigest digest
                    = MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    conteudo.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(
                    "SHA-256 não está disponível.", e
            );
        }
    }
}
