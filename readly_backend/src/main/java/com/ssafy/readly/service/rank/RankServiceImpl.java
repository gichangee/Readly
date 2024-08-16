package com.ssafy.readly.service.rank;

import com.ssafy.readly.dto.rank.GetRankGroupResponse;
import com.ssafy.readly.dto.rank.GetRankUserResponse;
import com.ssafy.readly.dto.rank.GetUserGroupsRankResponse;
import com.ssafy.readly.dto.rank.GetUserRankResponse;
import com.ssafy.readly.repository.rank.RankRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class RankServiceImpl implements RankService {

    private final RankRepository rankRepository;


    @Override
    public List<GetRankUserResponse> getMembers() throws Exception {
        return rankRepository.getMembers();
    }

    @Override
    public List<GetRankGroupResponse> getGroups() throws Exception {
        return rankRepository.getGroups();
    }

    @Override
    public GetUserRankResponse getUserRank(int memberId) throws Exception {
        return rankRepository.getUserRank(memberId);
    }

    @Override
    public List<GetUserGroupsRankResponse> getUserGroupsRank(int memberId) throws Exception {
        return rankRepository.getUserGroupsRank(memberId);
    }
}
