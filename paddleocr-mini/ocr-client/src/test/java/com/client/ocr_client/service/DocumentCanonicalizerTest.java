package com.client.ocr_client.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import org.junit.jupiter.api.Test;

class DocumentCanonicalizerTest {

    private final DocumentCanonicalizer canonicalizer
            = new DocumentCanonicalizer();

    @Test
    void shouldGenerateExpectedCanonicalContent() {
        String result = canonicalizer.canonicalize(
                "Maria",
                null,
                "RG"
        );

        assertEquals(
                "nome=5:Maria|cpf=-|tipo=2:RG",
                result
        );
    }

    @Test
    void shouldGenerateSameOutputForSameInputs() {
        String first = canonicalizer.canonicalize(
                "Maria", null, "RG"
        );

        String second = canonicalizer.canonicalize(
                "Maria", null, "RG"
        );

        assertEquals(first, second);
    }

    @Test
    void shouldDistinguishDifferentDocumentTypes() {
        String first = canonicalizer.canonicalize(
                "Maria", null, "RG"
        );

        String second = canonicalizer.canonicalize(
                "Maria", null, "CNH"
        );

        assertNotEquals(first, second);
    }
}
