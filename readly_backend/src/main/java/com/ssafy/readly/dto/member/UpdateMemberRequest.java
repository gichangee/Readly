package com.ssafy.readly.dto.member;

import com.ssafy.readly.enums.Gender;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class UpdateMemberRequest {
    private int id;
    private String nickname;
    private String memberName;
    private String phoneNumber;
    private String email;
    private LocalDate birthDate;
    private Gender gender;
    private String introduction;
}
