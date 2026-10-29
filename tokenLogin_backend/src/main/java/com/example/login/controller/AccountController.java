package com.example.login.controller;

import com.example.login.config.TokenProvider;
import com.example.login.dto.AccountInfo;
import com.example.login.dto.ResponseData;
import com.example.login.dto.UserState;
import com.example.login.service.AccountService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    private final TokenProvider tokenProvider;

    @GetMapping("/exists-id")
    public ResponseData existsAccountId(@RequestParam String accountId) {

        if (checkBlank(accountId) || 15 < accountId.length())
            return new ResponseData(false, "입력 값이 올바르지 않습니다.");

        if (accountService.existId(accountId))
            return new ResponseData(false, "사용 중인 아이디입니다.");

        return new ResponseData(true, "사용 가능한 아이디입니다.");
    }

    @GetMapping("/exists-nickname")
    public ResponseData existsNickName(@RequestParam String nickName) {

        if (checkBlank(nickName) || 10 < nickName.length())
            return new ResponseData(false, "입력 값이 올바르지 않습니다.");

        if (accountService.existNickName(nickName))
            return new ResponseData(false, "사용 중인 닉네임입니다.");

        return new ResponseData(true, "사용 가능한 닉네임입니다.");
    }

    @GetMapping("/find-id")
    public ResponseData findAccountId(@RequestParam String name, @RequestParam String phone) {

        if (checkBlank(name) || 10 < name.length()
                || checkBlank(phone) || !(11 == phone.length()) || !checkNumber(phone))
            return new ResponseData(false, "입력 값이 올바르지 않습니다.");

        AccountInfo accountInfo = accountService.findAccountId(name, phone);

        if (accountInfo == null) {
            return new ResponseData(false, "일치하는 회원이 없습니다.");
        } else {
            if (accountInfo.getBlock() == 1)
                return new ResponseData(false, "차단된 회원입니다.");

            return new ResponseData(true, (Object) accountInfo.getAccountId());
        }
    }

    @PostMapping("/find-pw")
    public ResponseData findPassword(@RequestBody Map<String, String> body) {

        String accountId = body.get("accountId");
        String name = body.get("name");
        String phone = body.get("phone");

        if (checkBlank(accountId) || 15 < accountId.length()
                || checkBlank(name) || 10 < name.length()
                || checkBlank(phone) || !(11 == phone.length()) || !checkNumber(phone))
            return new ResponseData(false, "입력 값이 올바르지 않습니다.");

        try {
            String tempPassword = accountService.resetPassword(accountId, name, phone);
            if (tempPassword != null) {
                return new ResponseData(true, (Object) tempPassword);
            }
        } catch (Exception e) {
            return new ResponseData(false, "비밀번호 찾기에 실패했습니다.");
        }
        return new ResponseData(false, "일치하는 회원이 없습니다.");
    }

    @PostMapping("/signup")
    public ResponseData signupAccount(@RequestBody Map<String, String> body) {

        String accountId = body.get("accountId");
        String password = body.get("password");
        String nickName = body.get("nickName");
        String name = body.get("name");
        String phone = body.get("phone");

        if (checkBlank(accountId) || 15 < accountId.length()
                || checkBlank(password)
                || checkBlank(nickName) || 10 < nickName.length()
                || checkBlank(name) || 10 < name.length()
                || checkBlank(phone) || !(11 == phone.length()) || !checkNumber(phone))
            return new ResponseData(false, "입력 값이 올바르지 않습니다.");

        try {
            if (accountService.registerAccount(accountId, password, nickName, name, phone))
                return new ResponseData(true, null);
        } catch (Exception e) {
            log.error("/signup", e);
            return new ResponseData(false, "회원 가입에 실패했습니다.");
        }
        return new ResponseData(false, "회원 가입에 실패했습니다.");
    }

    @PostMapping("/login")
    public ResponseData loginAccount(HttpServletResponse response, @RequestBody Map<String, String> body) {

        String accountId = body.get("accountId");
        String password = body.get("password");

        if (checkBlank(accountId) || checkBlank(password))
            return new ResponseData(false, "입력 값이 올바르지 않습니다.");

        Map<String, Object> data;
        try {
            data = accountService.login(accountId, password);
        } catch (Exception e) {
            log.error("/login", e);
            return new ResponseData(false, "다시 시도해 주세요");
        }

        boolean result = (boolean) data.get("result");
        if (result) {
            String refreshToken = (String) data.get("refreshToken");
            ResponseCookie responseCookie = ResponseCookie.from("reToken", refreshToken)
                    .path("/api")
                    .httpOnly(true)
                    .secure(false)
                    .sameSite("Lax")
                    .maxAge(Duration.ofDays(7))
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
            data.remove("refreshToken");
            return new ResponseData(result, data);
        }
        return new ResponseData(result, (String) data.get("message"));
    }

    @GetMapping("/account/profile")
    public ResponseData getProfileInfo(@RequestParam String accountId) {

        AccountInfo accountInfo = accountService.getAccountProfile(accountId);

        if (accountInfo != null) {
            Map<String, String> result = new HashMap<>();
            result.put("role", accountInfo.getRole());
            result.put("nickName", accountInfo.getNickName());
            result.put("name", accountInfo.getName());
            result.put("phone", accountInfo.getPhone());

            return new ResponseData(true, result);
        }
        return new ResponseData(false, null);
    }

    @PostMapping("/account/profile")
    public ResponseData updateProfileInfo(@AuthenticationPrincipal String authId, @RequestBody Map<String, String> body) {

        String accountId = body.get("accountId");
        String password = body.get("password");
        String nickName = body.get("nickName");
        String name = body.get("name");
        String phone = body.get("phone");

        if (!authId.equals(accountId) || accountId.isBlank() || !validValue(accountId) || 15 < accountId.length())
            return new ResponseData(false, null);

        if (!validValue(nickName) || 10 < nickName.length())
            return new ResponseData(false, null);

        if (!validValue(name) || 10 < name.length())
            return new ResponseData(false, null);

        if (!validValue(phone) || !validNumber(phone))
            return new ResponseData(false, null);

        if ((phone != null && !phone.isBlank()) && !(11 == phone.length()))
            return new ResponseData(false, null);

        try {
            if (accountService.modifyAccountProfile(accountId, password, nickName, name, phone)) {
                AccountInfo accountInfo = accountService.getAccountProfile(accountId);
                if (accountInfo != null) {
                    Map<String, String> result = new HashMap<>();
                    result.put("role", accountInfo.getRole());
                    result.put("nickName", accountInfo.getNickName());
                    result.put("name", accountInfo.getName());
                    result.put("phone", accountInfo.getPhone());

                    return new ResponseData(true, result);
                }
            }
        } catch (Exception e) {
            log.error("post /account/profile", e);
            return new ResponseData(false, null);
        }
        return new ResponseData(false, null);
    }


    @PostMapping("/account/withdraw")
    public ResponseData withdrawAccount(HttpServletResponse response, @AuthenticationPrincipal String authId, @RequestBody Map<String, String> body) {

        String accountId = body.get("accountId");

        if (!authId.equals(accountId))
            return new ResponseData(false, null);

        String password = body.get("password");
        if (checkBlank(password))
            return new ResponseData(false, "입력 값이 올바르지 않습니다");


        try {
            int result = accountService.withdrawAccount(accountId, password);
            if (result == -1) {
                return new ResponseData(false, "비밀번호가 일치하지 않습니다");
            } else if (result == 0) {
                return new ResponseData(false, null);
            } else {
                accountService.deleteRefreshToken(accountId);

                ResponseCookie responseCookie = ResponseCookie.from("reToken", "")
                        .path("/api")
                        .maxAge(0)
                        .build();
                response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());

                return new ResponseData(true, "탈퇴되었습니다");
            }
        } catch (Exception e) {
            log.error("/account/withdraw", e);
            return new ResponseData(false, null);
        }
    }

    @PostMapping("/logout")
    public ResponseData logout(@CookieValue(name = "reToken", required = false) String reToken, HttpServletResponse response) {

        if (reToken == null)
            return new ResponseData(false, null);

        String accountId = tokenProvider.getUserId(reToken);

        accountService.deleteRefreshToken(accountId);
        ResponseCookie responseCookie = ResponseCookie.from("reToken", "")
                .path("/api")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());

        return new ResponseData(true, null);
    }

    @PostMapping("/validation")
    public ResponseData validationToken(@CookieValue(name = "reToken", required = false) String reToken, HttpServletResponse response) {

        if (reToken == null)
            return new ResponseData(false, null);

        int checkToken = tokenProvider.validToken(reToken);
        String accountId = tokenProvider.getUserId(reToken);
        String role = (String) tokenProvider.getClaims(reToken).get("role");
        if (checkToken == 1) {
            String newAccessToken = tokenProvider.createAccessToken(accountId, role);
            AccountInfo accountInfo = accountService.getAccount(accountId);
            UserState userState = new UserState(newAccessToken, accountId, accountInfo.getRole(), accountInfo.getNickName());
            return new ResponseData(true, userState);
        } else if (checkToken == 0) {
            String getRefreshToken = accountService.getRefreshToken(accountId);
            String newRefreshToken = tokenProvider.createRefreshToken(accountId, role);
            if (!getRefreshToken.equals(newRefreshToken))
                return new ResponseData(false, null);

            accountService.updateRefreshToken(accountId, newRefreshToken);
            String newAccessToken = tokenProvider.createAccessToken(accountId, role);

            ResponseCookie responseCookie = ResponseCookie.from("reToken", newRefreshToken)
                    .path("/api")
                    .httpOnly(true)
                    .secure(false)
                    .sameSite("Lax")
                    .maxAge(Duration.ofDays(7))
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());
            AccountInfo accountInfo = accountService.getAccount(accountId);
            UserState userState = new UserState(newAccessToken, accountId, accountInfo.getRole(), accountInfo.getNickName());
            return new ResponseData(true, userState);
        }

        accountService.deleteRefreshToken(accountId);
        ResponseCookie responseCookie = ResponseCookie.from("reToken", "")
                .path("/api")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, responseCookie.toString());

        return new ResponseData(false, null);
    }

    public boolean checkBlank(String str) {

        if (!StringUtils.hasText(str))
            return true;

        return str.chars().anyMatch(Character::isWhitespace);
    }

    public boolean checkNumber(String str) {
        return str.matches("^[0-9]+$");
    }

    public boolean validValue(String str) {

        if (str == null || str.isBlank())
            return true;

        return str.chars().noneMatch(Character::isWhitespace);
    }

    public boolean validNumber(String str) {

        if (str == null || str.isBlank())
            return true;

        return str.matches("^[0-9]+$");
    }
}