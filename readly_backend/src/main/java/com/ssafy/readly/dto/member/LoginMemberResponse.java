package com.ssafy.readly.dto.member;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginMemberResponse {
    private Integer id;
    private String nickname;
    private Integer point;
    private String introduction;
}
