package com.client.ocr_client.dto;

import java.math.BigDecimal;

public class InvoiceItem{

  private String description;

  private int quantity;

  private BigDecimal amount;

  private String getDescription(){
    return description;
  }

  private void setDescription(String description){
    this.description = description;
  }

  public int getQuantity(){
    return quantity;
  }

  public BigDecimal getAmount(){
    return amount;
  }

  public void setAmount(BigDecimal amount){
    this.amount = amount;
  }

}