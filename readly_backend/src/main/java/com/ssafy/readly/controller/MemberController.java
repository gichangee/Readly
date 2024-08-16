package com.ssafy.readly.controller;

import com.ssafy.readly.dto.member.*;
import com.ssafy.readly.service.member.MemberService;
import com.ssafy.readly.util.CookieUtil;
import com.ssafy.readly.util.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MemberController {

    private final MemberService memberService;
    private final JWTUtil jwtUtil;

    @PostMapping("/member/signup")
    public ResponseEntity<?> singUp(@Valid @RequestBody SignUpMemberRequest signUpMember) throws Exception {
        memberService.signUp(signUpMember);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/member/duplicate/{loginid}")
    public ResponseEntity<?> checkDuplicateId(@PathVariable("loginid") String loginId) throws Exception {
        memberService.checkDuplicateId(loginId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/member/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginMemberRequest loginMember, HttpServletResponse response) throws Exception {
        Map<String, Object> responseMap = new HashMap<>();
        HttpStatus status = HttpStatus.ACCEPTED;

        LoginMemberResponse loginMemberResponse = memberService.login(loginMember);

        String accessToken = jwtUtil.createAccessToken(loginMemberResponse.getId());
        String refreshToken = jwtUtil.createRefreshToken(loginMemberResponse.getId());
        memberService.saveTokens(loginMemberResponse.getId(), refreshToken, accessToken);

        CookieUtil.createCookie(response, "refreshToken", refreshToken, 604800, true);
        responseMap.put("accessToken", accessToken);
        responseMap.put("loginInfo", loginMemberResponse);

        status = HttpStatus.CREATED;

        return new ResponseEntity<Map<String, Object>>(responseMap, status);
    }

    @GetMapping("/member/{id}")
    public ResponseEntity<Map<String, Object>> getMemberInfo(
            @PathVariable("id") Integer id, HttpServletRequest request) throws Exception {
        Map<String, Object> responseMap = new HashMap<>();
        HttpStatus status = HttpStatus.ACCEPTED;
        if (id.equals((Integer) request.getAttribute("memberId"))) {
            MemberResponse memberResponse = memberService.getMember(id);
            responseMap.put("memberInfo", memberResponse);
            status = HttpStatus.OK;
        } else {
            responseMap.put("errorMessage", "권한이 없습니다.");
            status = HttpStatus.FORBIDDEN;
        }

        return new ResponseEntity<Map<String, Object>>(responseMap, status);
    }

    @DeleteMapping("/member/{id}/logout")
    public ResponseEntity<Void> logout(@PathVariable("id") Integer id) throws Exception {
        memberService.deleteRefreshToken(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/member/{id}/token")
    public ResponseEntity<Map<String, Object>> createAccessToken(
            @PathVariable("id") Integer id, HttpServletRequest request) {
        Map<String, Object> responseMap = new HashMap<>();
        HttpStatus status = HttpStatus.ACCEPTED;
        String refreshToken = CookieUtil.getCookie("refreshToken", request);
        if(jwtUtil.checkToken(refreshToken)) {
            if (refreshToken.equals(memberService.getRefreshToken(id))) {
                String accessToken = jwtUtil.createAccessToken(id);
                memberService.saveAccessToken(id, accessToken);
                responseMap.put("accessToken", accessToken);
                status = HttpStatus.CREATED;
            }
        } else {
            status = HttpStatus.UNAUTHORIZED;
        }

        return new ResponseEntity<Map<String, Object>>(responseMap, status);
    }

    @PatchMapping("/member")
    public ResponseEntity<Void> updateMember(@RequestBody UpdateMemberRequest updateMemberRequest) throws Exception {
        memberService.updateMember(updateMemberRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
