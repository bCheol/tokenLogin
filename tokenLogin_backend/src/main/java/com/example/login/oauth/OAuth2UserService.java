package com.example.login.oauth;

import com.example.login.mapper.AccountMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final AccountMapper accountMapper;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User user = super.loadUser(userRequest);
        String email = (String) user.getAttributes().get("email");

        String provider = null;
        String[] providerList = { "gmail" };
        for (String data: providerList) {
            if (email.contains(data)) {
                provider = data;
                break;
            }
        }

        if (accountMapper.existsOAuth(provider, email) == 0) {
            saveOAuthInfo(0, provider, user);
        } else {
            saveOAuthInfo(1, provider, user);
        }

        return user;
    }

    public void saveOAuthInfo(int type, String provider, OAuth2User oAuth2User) {
        Map<String, Object> map = oAuth2User.getAttributes();
        String providerId = (String) map.get("sub");
        String email = (String) map.get("email");
        String name = (String) map.get("name");
        if (type == 0) {
            accountMapper.insertOAuth(provider, providerId, email, name);
        } else {
            accountMapper.updateOAuth(provider, email, name);
        }
    }

}