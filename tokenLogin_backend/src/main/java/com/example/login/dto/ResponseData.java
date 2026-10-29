package com.example.login.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
public class ResponseData {

    boolean result;
    String message;
    Object data;

    public ResponseData(boolean result, String message) {
        this.result = result;
        this.message = message;
    }

    public ResponseData(boolean result, Object data) {
        this.result = result;
        this.data = data;
    }
}