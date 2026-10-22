package com.client.ocr_client.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

class CpfValidatorTest {

    private final CpfValidator validator = new CpfValidator();

    @Test
    void shouldRejectIncorrectLength() {
        assertFalse(validator.isValid("123"));
    }

    @Test
    void shouldRejectRepeatedDigits() {
        assertFalse(validator.isValid("11111111111"));
        assertFalse(validator.isValid("00000000000"));
    }

    @Test
    void shouldRejectInvalidCheckDigits() {
        assertFalse(validator.isValid("12345678900"));
    }

    @Test
    void shouldAcceptValidCheckDigits() {
        // Synthetic example for algorithm testing only.
        assertTrue(validator.isValid("12345678909"));
    }

    @Test
    void shouldAcceptFormattedCpf() {
        assertTrue(validator.isValid("123.456.789-09"));
    }

    @Test
    void shouldRejectNullOrEmptyCpf() {
        assertFalse(validator.isValid(null));
        assertFalse(validator.isValid(""));
    }
}
