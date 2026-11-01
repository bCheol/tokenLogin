package com.example.login.oauth;

import com.example.login.config.TokenProvider;
import com.example.login.dto.OAuthInfo;
import com.example.login.mapper.AccountMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.Duration;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AccountMapper accountMapper;
    private final TokenProvider tokenProvider;
    private final OAuth2AuthorizationRequestBasedOnCookieRepository oAuth2AuthorizationRequestBasedOnCookieRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        String provider = null;
        String[] providerList = { "gmail" };
        for (String data: providerList) {
            if (email.contains(data)) {
                provider = data;
                break;
            }
        }

        OAuthInfo oAuthInfo = accountMapper.selectOAuth(provider, email);
        String accessToken = tokenProvider.createAccessToken(email, oAuthInfo.getRole());

        String refreshToken = tokenProvider.createRefreshToken(email, oAuthInfo.getRole());
        try {
            accountMapper.insertRefreshToken(provider, email, refreshToken);
        } catch (DuplicateKeyException e) {
            accountMapper.updateRefreshToken(provider, email, refreshToken);
        }

        ResponseCookie responseCookie = ResponseCookie.from("reToken", refreshToken)
                .path("/api")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .maxAge(Duration.ofDays(7))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());

        clearAuthenticationAttributes(request, response);

        String successUrl = getSuccessUrl(accessToken);
        getRedirectStrategy().sendRedirect(request, response, successUrl);
    }

    private String getSuccessUrl(String token) {
        return UriComponentsBuilder.fromUriString("http://localhost:3000/oauth/callback")
//        return UriComponentsBuilder.fromUriString("/oauth/callback")
                .queryParam("accessToken", token)
                .build()
                .toUriString();
    }

    private void clearAuthenticationAttributes(HttpServletRequest request, HttpServletResponse response) {
        super.clearAuthenticationAttributes(request);
        oAuth2AuthorizationRequestBasedOnCookieRepository.removeAuthorizationRequestCookies(request, response);
    }

}