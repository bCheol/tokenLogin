package com.example.login.service;

import com.example.login.config.AesUtil;
import com.example.login.config.TokenProvider;
import com.example.login.dto.AccountInfo;
import com.example.login.mapper.AccountMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountMapper accountMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final AesUtil aesUtil;

    @Value("${TEMP_PW_KEY}")
    String TEMP_PASSWORD_CHARS;

    public boolean existId(String id) {

        if (accountMapper.existId(id) == 1)
            return true;

        return false;
    }

    public boolean existNickName(String nickName) {

        if (accountMapper.existNickName(nickName) == 1)
            return true;

        return false;
    }

    public boolean existHsName(String name) {

        String hsName = aesUtil.createHashValue(name);
        if (accountMapper.existHsName(hsName) == 1)
            return true;

        return false;
    }

    public boolean existHsPhone(String phone) {

        String hsPhone = aesUtil.createHashValue(phone);
        if (accountMapper.existHsPhone(hsPhone) == 1)
            return true;

        return false;
    }

    public AccountInfo findAccountId(String name, String phone) {

        String hsName = aesUtil.createHashValue(name);
        String hsPhone = aesUtil.createHashValue(phone);
        AccountInfo accountInfo = accountMapper.selectId(hsName, hsPhone);
        return accountInfo;
    }

    @Transactional(rollbackFor = Exception.class)
    public String resetPassword(String id, String name, String phone) {

        String hsName = aesUtil.createHashValue(name);
        String hsPhone = aesUtil.createHashValue(phone);
        String orgPassword = accountMapper.selectPassword(id, hsName, hsPhone);
        if (orgPassword != null) {
            String tempPassword = createTempPassword();
            String encodeTempPw = passwordEncoder.encode(tempPassword);
            if (accountMapper.insertPassword(id, encodeTempPw) == 1)
                return tempPassword;
        }
        return null;
    }

    private String createTempPassword() {

        StringBuilder sb = new StringBuilder(10);
        SecureRandom secureRandom = new SecureRandom();
        for (int i = 0; i < 10; i++) {
            sb.append(TEMP_PASSWORD_CHARS.charAt(secureRandom.nextInt(TEMP_PASSWORD_CHARS.length())));
        }
        return sb.toString();
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean registerAccount(String id, String pw, String nickName, String name, String phone) {

        String encodePw = passwordEncoder.encode(pw);
        String encryptName = aesUtil.encrypt(name);
        String hsName = aesUtil.createHashValue(name);
        String encryptPhone = aesUtil.encrypt(phone);
        String hsPhone = aesUtil.createHashValue(phone);

        if (existId(id) || existNickName(nickName) || existHsName(hsName) || existHsPhone(hsPhone))
            throw new RuntimeException();

        if (accountMapper.insertAccount(id, encodePw, nickName, encryptName, hsName, encryptPhone, hsPhone) == 1)
            return true;

        return false;
    }

    public AccountInfo getAccount(String id) {

        return accountMapper.selectAccount(id);
    }

    public Map<String, Object> login(String id, String pw) {

        Map<String, Object> map = new HashMap<>();

        AccountInfo accountInfo = getAccount(id);
        if (accountInfo == null) {
            map.put("result", false);
            map.put("message", "존재하지 않는 회원입니다.");
            return map;
        }

        if (passwordEncoder.matches(pw, accountInfo.getPassword())) {
            String accessToken = tokenProvider.createAccessToken(accountInfo.getAccountId(), accountInfo.getRole());
            String refreshToken = tokenProvider.createRefreshToken(accountInfo.getAccountId(), accountInfo.getRole());

            try {
                accountMapper.insertRefreshToken(accountInfo.getAccountId(), refreshToken);
            } catch (DuplicateKeyException e) {
                accountMapper.updateRefreshToken(accountInfo.getAccountId(), refreshToken);
            }

            map.put("result", true);
            map.put("accessToken", accessToken);
            map.put("refreshToken", refreshToken);
            map.put("accountId", accountInfo.getAccountId());
            map.put("role", accountInfo.getRole());
            map.put("nickName", accountInfo.getNickName());
        } else {
            map.put("result", false);
            map.put("message", "아이디와 비밀번호가 일치하지 않습니다.");
        }
        return map;
    }


    public AccountInfo getAccountProfile(String id) {

        AccountInfo accountInfo = getAccount(id);
        if (accountInfo == null)
            return null;

        String name = aesUtil.nameInfo(accountInfo.getName());
        accountInfo.setName(name);

        String phone = aesUtil.phoneInfo(accountInfo.getPhone());
        accountInfo.setPhone(phone);

        return accountInfo;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean modifyAccountProfile(String id, String pw, String nickName, String name, String phone) {

        AccountInfo accountInfo = getAccount(id);
        if (accountInfo == null)
            return false;

        String encodeNewPw = null;
        if (pw != null && !pw.isBlank())
            encodeNewPw = passwordEncoder.encode(pw);

        String encryptName = null;
        String hsName = null;
        if (name != null && !name.isBlank()) {
            encryptName = aesUtil.encrypt(name);
            hsName = aesUtil.createHashValue(name);
        }

        String encryptPhone = null;
        String hsPhone = null;
        if (phone != null && !phone.isBlank()) {
            encryptPhone = aesUtil.encrypt(phone);
            hsPhone = aesUtil.createHashValue(phone);
        }

        if (accountMapper.updateAccount(id, encodeNewPw, nickName, encryptName, hsName, encryptPhone, hsPhone) == 1)
            return true;

        return false;
    }

    @Transactional(rollbackFor = Exception.class)
    public int withdrawAccount(String id, String pw) {

        AccountInfo accountInfo = getAccount(id);

        if (passwordEncoder.matches(pw, accountInfo.getPassword())) {
            return accountMapper.withdrawAccount(id);
        } else {
            return -1;
        }
    }

    public String getRefreshToken(String id) {
        return accountMapper.selectRefreshToken(id);
    }

    public int updateRefreshToken(String id, String token) {
        return accountMapper.updateRefreshToken(id, token);
    }

    public int deleteRefreshToken(String id) {
        return accountMapper.deleteRefreshToken(id);
    }

}