package com.client.ocr_client.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.client.ocr_client.dto.ValidationErrorResponse;

@RestController
public class GlobalExceptionHandler {

    @ExceptionHandler
    public ResponseEntity<ValidationErrorResponse> handleInvoiceValidation(
            InvoiceValidationException exception
    ) {
        ValidationErrorResponse response = new ValidationErrorResponse(
                exception.getMessage(),
                exception.getErrors());

        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(response);
    }

}
