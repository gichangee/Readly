package com.ssafy.readly.service.member;

import com.ssafy.readly.dto.member.*;
import com.ssafy.readly.entity.Member;

import javax.security.sasl.AuthenticationException;

public interface MemberService {

    Member getMemberEntity(Integer id);
    void signUp(SignUpMemberRequest signUpMember);
    void checkDuplicateId(String loginId);
    LoginMemberResponse login(LoginMemberRequest longinMember) throws AuthenticationException;
    void saveTokens(Integer id, String refreshToken, String accessToken);
    void saveAccessToken(Integer id, String accessToken);
    String getRefreshToken(Integer id);
    String getAccessToken(Integer id);
    void deleteRefreshToken(Integer id);
    MemberResponse getMember(Integer id);
    void updateMember(UpdateMemberRequest updateMember);
    Integer addPoint(Integer memberId, Integer point);
    MemberResponse getMemberbyLoginId(String loginid);
}
