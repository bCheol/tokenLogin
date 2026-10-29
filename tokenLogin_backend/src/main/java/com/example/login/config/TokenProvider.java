package com.example.login.config;

import com.example.login.mapper.AccountMapper;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Duration;
import java.util.*;

@Component
public class TokenProvider {

    Key key;
    AccountMapper accountMapper;

    public TokenProvider(@Value("${JWT_KEY}") String jwtKey, AccountMapper accountMapper) {
        byte[] keyBytes = Decoders.BASE64.decode(jwtKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.accountMapper = accountMapper;
    }

    public String createAccessToken(String accountId, String role) {
        Date iatDate = new Date();
        Date expDate = new Date(new Date().getTime() + Duration.ofMinutes(30).toMillis());

        return Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)
                .setIssuedAt(iatDate)
                .setExpiration(expDate)
                .setSubject(accountId)
                .addClaims(claims(role))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String createRefreshToken(String accountId, String role) {
        Date iatDate = new Date();
        Date expDate = new Date(new Date().getTime() + Duration.ofDays(7).toMillis());

        return Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)
                .setIssuedAt(iatDate)
                .setExpiration(expDate)
                .setSubject(accountId)
                .addClaims(claims(role))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Map<String, Object> claims(String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return claims;
    }

    public int validToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return 1;
        }  catch (ExpiredJwtException e) {
            return 0;
        } catch (Exception e) {
            return -1;
        }
    }

    public String getUserId(String token) {
        return getClaims(token).getSubject();
    }

    public Claims getClaims(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(key)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    public Authentication getAuthentication(String token) {
        Claims claims = getClaims(token);
        Set<SimpleGrantedAuthority> authoritySet = Collections.singleton(new SimpleGrantedAuthority(claims.get("role").toString()));
        return new UsernamePasswordAuthenticationToken(getUserId(token), null, authoritySet);
    }

}