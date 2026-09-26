package com.client.ocr_client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OCRPage{

  @JsonProperty("page_number")
  private int pageNumber;
  private String text;

  public int getPageNumber() {
    return pageNumber;
  } 

  public void setPageNumber(int pageNumber){
    this.pageNumber = pageNumber;
  }

  public String getText(){
    return text;
  }

  public void setText(String text){
    this.text = text;
  }
}