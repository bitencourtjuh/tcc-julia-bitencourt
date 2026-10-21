package com.client.ocr_client.service;

package com.client.ocr_client.service;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Service
public class HashService{
  public String gerarHash(String conteudo){
    try{
      MessageDigest digest = MessageDigest.getInstance("SHA-256");

      byte[] has = digest.digest(
        conteudo.getBytes(StandartCharsets.UTF_8)
      );

      return HexFormat.of().formatHex(hash);

    }catch (NoSuchAlgorithmException e){
      throw new IllegalStateException(
          "SHA-256 não esta disponivel.", e
      );
    }
  }
}