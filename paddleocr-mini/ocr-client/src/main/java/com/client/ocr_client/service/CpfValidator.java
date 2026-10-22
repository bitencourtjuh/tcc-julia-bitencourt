package com.client.ocr_client.service;

import org.springframework.stereotype.Component;

@Component
public class CpfValidator {

    public boolean isValid(String cpf) {
        if (cpf == null || cpf.isBlank()) {
            return false;
        }

        String digits = cpf.replaceAll("\\D", "");

        if (!digits.matches("\\d{11}")) {
            return false;
        }

        // Reject repeated digits, e.g. 00000000000.
        if (digits.matches("(\\d)\\1{10}")) {
            return false;
        }

        int firstDigit = calculateDigit(digits, 9, 10);
        int secondDigit = calculateDigit(digits, 10, 11);

        return firstDigit == Character.digit(digits.charAt(9), 10)
                && secondDigit == Character.digit(digits.charAt(10), 10);
    }

    private int calculateDigit(
            String digits,
            int count,
            int initialWeight
    ) {
        int sum = 0;

        for (int i = 0; i < count; i++) {
            int digit = Character.digit(digits.charAt(i), 10);
            sum += digit * (initialWeight - i);
        }

        int remainder = (sum * 10) % 11;

        return remainder == 10 ? 0 : remainder;
    }
}
