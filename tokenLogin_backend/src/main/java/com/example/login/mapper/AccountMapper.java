package com.example.login.mapper;

import com.example.login.dto.AccountInfo;
import com.example.login.dto.OAuthInfo;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AccountMapper {

    int existId(String id);
    int existNickName(String nickName);
    int existHsName(String hsName);
    int existHsPhone(String hsPhone);
    AccountInfo selectId(String hsName, String hsPhone);
    String selectPassword(String id, String hsName, String hsPhone);
    int insertPassword(String id, String password);
    int insertAccount(String id, String password, String nickName, String name, String hsName, String phone, String hsPhone);
    AccountInfo selectAccount(String id);
    int updateAccount(String id, String password, String nickName, String name, String hsName, String phone, String hsPhone);
    int withdrawAccount(String id);
    String selectRefreshToken(String provider, String id);
    int insertRefreshToken(String provider, String id, String refreshToken);
    int updateRefreshToken(String provider, String id, String refreshToken);
    int deleteRefreshToken(String provider, String id);

    int existsOAuth(String provider, String email);
    OAuthInfo selectOAuth(String provider, String email);
    int insertOAuth(String provider, String providerId, String email, String name);
    int updateOAuth(String provider, String providerId, String name);
}