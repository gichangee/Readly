package com.ssafy.readly.dto.member;

import com.ssafy.readly.enums.Gender;
import com.ssafy.readly.enums.Social;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class SignUpMemberRequest {
    @NotBlank(message = "아이디")
    private String loginId;
    @NotBlank
    @Pattern(regexp="(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,16}",
            message = "비밀번호는 영문 대문자, 소문자, 숫자 및 특수기호가 각각 최소 1개 이상 포함되어야 하며, 길이는 8자 이상 16자 이하이어야 합니다.")
    private String loginPwd;
    @NotEmpty(message = "닉네임")
    private String nickname;
    @NotBlank(message = "이름")
    private String memberName;
    @NotBlank(message = "휴대폰 번호")
    private String phoneNumber;
    @Email(message = "이메일 형식을 확인해주세요.")
    @NotBlank(message = "이메일")
    private String email;
    private LocalDate birthday;
    private Gender gender;
    private Social social;

    public SignUpMemberRequest(String loginId, String loginPwd, String nickname, String memberName, String phoneNumber, String email, LocalDate birthday, Gender gender, Social social) {
        this.loginId = loginId;
        this.loginPwd = loginPwd;
        this.nickname = nickname;
        this.memberName = memberName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.birthday = birthday;
        this.gender = gender;
        if(social != null) {
            this.social = social;
        }
    }
}
