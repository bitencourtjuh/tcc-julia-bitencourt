package com.client.ocr_client.service;

import java.net.http.HttpClient;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.client.ocr_client.dto.OCRResponse;

@Service
public class OcrClient {

    private final RestClient restClient;

    public OcrClient(@Value("${ocr.service.url}") String ocrServiceUrl) {

        // Criação de utilização forçada do HttpClient para HTTP/1.1
        HttpClient httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .build();

        JdkClientHttpRequestFactory requestFactory
                = new JdkClientHttpRequestFactory(httpClient);

        this.restClient = RestClient.builder()
                .baseUrl(ocrServiceUrl)
                .requestFactory(requestFactory)
                .build();
    }

    public OCRResponse sendToOcr(MultipartFile file) throws Exception {

        MultipartBodyBuilder builder = new MultipartBodyBuilder();

        builder.part("file", file.getResource())
                .filename(file.getOriginalFilename());

        try {
            return restClient.post()
                    .uri("/ocr")
                    .body(builder.build())
                    .retrieve()
                    .body(OCRResponse.class);

        } catch (RestClientResponseException ex) {

            if (ex.getStatusCode().is5xxServerError()) {
                throw new ResponseStatusException(
                        HttpStatus.SERVICE_UNAVAILABLE,
                        "Serviço OCR indisponível. Tente novamente.",
                        ex
                );
            }

            throw ex;

        } catch (ResourceAccessException ex) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Não foi possível conectar ao serviço FastAPI.",
                    ex
            );
        }
    }
}
