package com.client.ocr_client;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class OcrClientApplication {

	public static void main(String[] args) {
		SpringApplication.run(OcrClientApplication.class, args);
	}

}
