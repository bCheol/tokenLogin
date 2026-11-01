package com.example.login.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class OAuthInfo {

    String provider;
    String providerId;
    String email;
    String role;
    String name;

}
