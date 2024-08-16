package com.ssafy.readly.repository.member;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.readly.dto.member.LoginMemberRequest;
import com.ssafy.readly.dto.member.LoginMemberResponse;
import com.ssafy.readly.dto.member.MemberResponse;
import com.ssafy.readly.entity.Member;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import static com.querydsl.core.types.ExpressionUtils.count;
import static com.ssafy.readly.entity.QMember.member;

@Repository
public class MemberRepositoryImpl implements MemberRepository {

    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    public MemberRepositoryImpl(EntityManager em) {
        this.em = em;
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public void signUp(Member member) {
        em.persist(member);
    }

    @Override
    public Optional<LoginMemberResponse> login(LoginMemberRequest longinMember) {
        return Optional.ofNullable(queryFactory
                .select(Projections.constructor(LoginMemberResponse.class,
                        member.id, member.nickname, member.point, member.introduction))
                .from(member)
                .where(member.loginId.eq(longinMember.getLoginId()),
                        member.loginPwd.eq(longinMember.getLoginPwd()))
                .fetchOne());
    }

    @Override
    public Optional<String> findRefreshTokenById(Integer id) {
        return Optional.ofNullable(
                queryFactory
                .select(member.refreshToken)
                .from(member)
                .where(member.id.eq(id))
                .fetchOne());
    }

    @Override
    public Optional<String> findAccessTokenById(Integer id) {
        return Optional.ofNullable(
                queryFactory
                        .select(member.accessToken)
                        .from(member)
                        .where(member.id.eq(id))
                        .fetchOne());
    }

    @Override
    public Optional<Member> findById(Integer id) {
        return Optional.ofNullable(em.find(Member.class, id));
    }

    @Override
    public Long findByLoginId(String loginId) {
        return queryFactory
                .select(count(member.id))
                .from(member)
                .where(member.loginId.eq(loginId))
                .fetchOne();
    }

    /**
     * @param LoginId
     * @return
     */
    @Override
    public Optional<MemberResponse> findDataByLoginId(String LoginId) {
        return Optional.ofNullable(queryFactory
                .select(Projections.constructor(MemberResponse.class,
                        member.id,
                        member.loginId,
                        member.nickname,
                        member.memberName,
                        member.phoneNumber,
                        member.email,
                        member.point,
                        member.birthday,
                        member.joinDate,
                        member.gender,
                        member.introduction))
                .from(member)
                .where(member.loginId.eq(LoginId))
                .fetchOne());
    }
}
