package com.ssafy.readly.service.follower;

import com.ssafy.readly.dto.follower.RequestFollowerDto;
import com.ssafy.readly.repository.follower.FollowerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class FollowerServiceImpl implements FollowerService {

    private final FollowerRepository followerRepository;

    @Override
    public void addFollower(RequestFollowerDto requestFollowerDto) throws Exception {
        followerRepository.addFollower(requestFollowerDto);

    }

    @Override
    public void deleteFollower(RequestFollowerDto requestFollowerDto) throws Exception {
        followerRepository.deleteFollower(requestFollowerDto);
    }
}
