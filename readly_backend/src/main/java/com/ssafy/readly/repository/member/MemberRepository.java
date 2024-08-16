package com.ssafy.readly.repository.member;

import com.ssafy.readly.dto.member.LoginMemberRequest;
import com.ssafy.readly.dto.member.LoginMemberResponse;
import com.ssafy.readly.dto.member.MemberResponse;
import com.ssafy.readly.entity.Member;

import java.util.Optional;

public interface MemberRepository {

    void signUp(Member member);
    Optional<LoginMemberResponse> login(LoginMemberRequest longinMember);
    Optional<String> findRefreshTokenById(Integer id);
    Optional<String> findAccessTokenById(Integer id);
    Optional<Member> findById(Integer id);
    Long findByLoginId(String loginId);
    Optional<MemberResponse> findDataByLoginId(String LoginId);
}