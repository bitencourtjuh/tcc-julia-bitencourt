package com.client.ocr_client.service;

import java.net.http.HttpClient;

import com.client.ocr_client.dto.OCRResponse;

import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

@Service
public class OcrClient {

    private final RestClient restClient;

    public OcrClient() {

        // Criação de utilização forçada do HttpClient para HTTP/1.1
        HttpClient httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .build();

        JdkClientHttpRequestFactory requestFactory
                = new JdkClientHttpRequestFactory(httpClient);

        this.restClient = RestClient.builder()
                .baseUrl("http://127.0.0.1:8000")
                .requestFactory(requestFactory)
                .build();
    }

    public OCRResponse sendToOcr(MultipartFile file) throws Exception {

        MultipartBodyBuilder builder = new MultipartBodyBuilder();

        builder.part("file", file.getResource())
                .filename(file.getOriginalFilename());

        return restClient.post()
                .uri("/ocr")
                .body(builder.build())
                .retrieve()
                .body(OCRResponse.class);
    }
}
