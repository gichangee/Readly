package com.ssafy.readly.repository.follower;

import com.ssafy.readly.dto.follower.RequestFollowerDto;

public interface FollowerRepository {
    void addFollower(RequestFollowerDto requestFollowerDto) throws Exception;

    void deleteFollower(RequestFollowerDto requestFollowerDto) throws Exception;
}
