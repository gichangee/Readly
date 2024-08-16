package com.ssafy.readly.service.member;

import com.ssafy.readly.dto.member.SignUpMemberRequest;
import com.ssafy.readly.entity.Member;
import com.ssafy.readly.enums.Gender;
import com.ssafy.readly.enums.Social;
import com.ssafy.readly.repository.member.MemberRepositoryImpl;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@Transactional
class MemberServiceImplTest {

    @Autowired
    EntityManager entityManager;

    @Autowired
    MemberServiceImpl memberServiceImpl;

    @Autowired
    private MemberRepositoryImpl memberRepositoryImpl;

    @Test
    public void signUpTest() {
        // Given
        SignUpMemberRequest signUpMember = new SignUpMemberRequest(
                "ehddls",
                "1234",
                "동동인",
                "서동인",
                "000-1111-2222",
                "ehddls@naver.com",
                LocalDate.of(1996, 7, 25),
                Gender.M,
                Social.R);

        // When
        memberServiceImpl.signUp(signUpMember);
        Optional<Member> findMember = memberRepositoryImpl.findById(1);

        // Then
        assertThat(findMember).isPresent();

        findMember.ifPresent(member ->
                assertThat(member.getLoginId()).isEqualTo("ehddls"));
    }

    @Test
    public void dupcheckDuplicateIdTest() {
        // Given
        SignUpMemberRequest signUpMember = new SignUpMemberRequest(
                "ehddls",
                "1234",
                "동동인",
                "서동인",
                "000-1111-2222",
                "ehddls@naver.com",
                LocalDate.of(1996, 7, 25),
                Gender.M,
                Social.R);

        memberServiceImpl.signUp(signUpMember);

        // When Then
        assertThrows(IllegalStateException.class, () -> {
            memberServiceImpl.checkDuplicateId("ehddls");
        });
    }
}