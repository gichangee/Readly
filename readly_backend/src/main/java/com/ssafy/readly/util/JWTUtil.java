package com.ssafy.readly.util;

import com.ssafy.readly.exception.UnAuthorizedException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Map;

@Component
public class JWTUtil {

    @Value("${jwt.salt}")
    private String salt;

    @Value("${jwt.access-token.expirationtime}")
    private long accessTokenExpirationTime;

    @Value("${jwt.refresh-token.expirationtime}")
    private long refreshTokenExpirationTime;

    public String createAccessToken(Integer id) {
        return create(id, "access-token", accessTokenExpirationTime);
    }

    public String createRefreshToken(Integer id) {
        return create(id, "refresh-token", refreshTokenExpirationTime);
    }

    private String create(Integer id, String subject, long expirationTime) {
        Claims claims = Jwts.claims()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime));

        if(subject.equals("access-token")) {
            claims.put("id", id);
        }

        String jwt = Jwts.builder()
                .setHeaderParam("type", "JWT")
                .setClaims(claims)
                .signWith(SignatureAlgorithm.HS256, this.generateKey())
                .compact();

        return jwt;
    }

    private byte[] generateKey() {
        byte[] key = null;
        try {
            key = salt.getBytes("UTF-8");
        } catch (UnsupportedEncodingException e) {}
        return key;
    }

    public boolean checkToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parser().setSigningKey(this.generateKey()).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Integer getMemberId(String authorization) {
        Jws<Claims> claims = null;
        try {
            claims = Jwts.parser().setSigningKey(this.generateKey()).parseClaimsJws(authorization);
        } catch (Exception e) {
            throw new UnAuthorizedException();
        }
        Map<String, Object> value = claims.getBody();
        return (Integer) value.get("id");
    }
}
