package com.ssafy.readly.dto.member;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class LoginMemberRequest {
    @NotBlank(message = "아이디")
    private String loginId;
    @NotBlank(message = "비밀번호")
    private String loginPwd;
}
