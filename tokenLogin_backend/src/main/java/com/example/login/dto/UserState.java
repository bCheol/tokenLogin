package com.example.login.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserState {

    String accessToken;
    String accountId;
    String role;
    String nickName;
}
