package com.example.login.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountInfo {

    String accountId;
    String password;
    String role;
    String nickName;
    String name;
    String hsName;
    String phone;
    String hsPhone;
    Integer block;
}