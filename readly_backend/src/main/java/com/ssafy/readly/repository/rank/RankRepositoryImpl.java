package com.ssafy.readly.repository.rank;


import com.ssafy.readly.dto.rank.GetRankGroupResponse;
import com.ssafy.readly.dto.rank.GetRankUserResponse;
import com.ssafy.readly.dto.rank.GetUserGroupsRankResponse;
import com.ssafy.readly.dto.rank.GetUserRankResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class RankRepositoryImpl implements RankRepository {
    private final EntityManager entityManager;

    @Override
    public List<GetRankUserResponse> getMembers() {
        String jpql = "SELECT new com.ssafy.readly.dto.rank.GetRankUserResponse(m.id, m.memberName, COUNT(rb.id)) " +
                "FROM Member m " +
                "LEFT JOIN ReadBook rb ON m.id = rb.member.id " +
                "GROUP BY m.id, m.memberName " +
                "ORDER BY COUNT(rb.id) DESC";

        TypedQuery<GetRankUserResponse> query = entityManager.createQuery(jpql, GetRankUserResponse.class);
        query.setMaxResults(3);  // 상위 3개 결과만 가져오기

        return query.getResultList();
    }

    @Override
    public List<GetRankGroupResponse> getGroups() throws Exception {
        String jpql = "SELECT new com.ssafy.readly.dto.rank.GetRankGroupResponse(g.id, g.title, COUNT(rb.id)) " +
                "FROM Group g " +
                "LEFT JOIN ReadBook rb ON g.id = rb.group.id " +
                "GROUP BY g.id, g.title " +
                "ORDER BY COUNT(rb.id) DESC";

        TypedQuery<GetRankGroupResponse> query = entityManager.createQuery(jpql, GetRankGroupResponse.class);
        query.setMaxResults(3);  // 상위 3개 결과만 가져오기

        return query.getResultList();
    }


    @Override
    public GetUserRankResponse getUserRank(int memberId) {
        String jpql = "SELECT new com.ssafy.readly.dto.rank.GetUserRankResponse(m.id, m.memberName, COUNT(rb.id)) " +
                "FROM Member m " +
                "LEFT JOIN ReadBook rb ON m.id = rb.member.id " +
                "GROUP BY m.id, m.memberName " +
                "ORDER BY COUNT(rb.id) DESC";

        TypedQuery<GetUserRankResponse> query = entityManager.createQuery(jpql, GetUserRankResponse.class);
        List<GetUserRankResponse> resultList = query.getResultList();

        for (int i = 0; i < resultList.size(); i++) {
            if (resultList.get(i).getId()==memberId) {
                GetUserRankResponse userRank = resultList.get(i);
                userRank.setRank(i + 1);  // 랭킹을 1부터 시작하도록 설정
                return userRank;
            }
        }

        return null;  // 해당 멤버를 찾지 못한 경우
    }


    @Override
    public List<GetUserGroupsRankResponse> getUserGroupsRank(int memberId) {
        String jpql = "SELECT new com.ssafy.readly.dto.rank.GetRankGroupResponse(g.id, g.title, COUNT(rb.id)) " +
                "FROM Group g " +
                "LEFT JOIN ReadBook rb ON g.id = rb.group.id " +
                "GROUP BY g.id, g.title " +
                "ORDER BY COUNT(rb.id) DESC";

        TypedQuery<GetRankGroupResponse> query = entityManager.createQuery(jpql, GetRankGroupResponse.class);
        List<GetRankGroupResponse> allGroupRanks = query.getResultList();

        String memberGroupsJpql = "SELECT g.id FROM Group g JOIN GroupMember gm ON g.id = gm.group.id WHERE gm.member.id = :memberId";
        TypedQuery<Integer> memberGroupsQuery = entityManager.createQuery(memberGroupsJpql, Integer.class);
        memberGroupsQuery.setParameter("memberId", memberId);
        List<Integer> memberGroupIds = memberGroupsQuery.getResultList();

        List<GetUserGroupsRankResponse> userGroupsRanks = new ArrayList<>();
        for (int i = 0; i < allGroupRanks.size(); i++) {
            GetRankGroupResponse groupRank = allGroupRanks.get(i);
            if (memberGroupIds.contains(groupRank.getId())) {
                userGroupsRanks.add(new GetUserGroupsRankResponse(groupRank.getId(), groupRank.getTitle(), groupRank.getBooksReadCount(), i + 1));
            }
        }

        return userGroupsRanks;
    }


}
