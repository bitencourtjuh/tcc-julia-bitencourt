package com.client.ocr_client.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class HashServiceTest {

    private final HashService hashService = new HashService();

    @Test
    void shouldGenerateConsistentHash() {
        String input = "Documento de teste";

        String first = hashService.gerarHash(input);
        String second = hashService.gerarHash(input);

        assertEquals(first, second);
        assertEquals(64, first.length());
    }

    @Test
    void shouldDetectContentChanges() {
        String first = hashService.gerarHash("Documento A");
        String second = hashService.gerarHash("Documento B");

        assertNotEquals(first, second);
    }

    @Test
    void shouldGenerateKnownSha256Value() {
        String hash = hashService.gerarHash("abc");

        assertEquals(
                "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
                hash
        );
    }
}
