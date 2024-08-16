package com.ssafy.readly.service.follower;

import com.ssafy.readly.dto.follower.RequestFollowerDto;

public interface FollowerService {
    void addFollower(RequestFollowerDto requestFollowerDto) throws Exception;

    void deleteFollower(RequestFollowerDto requestFollowerDto) throws Exception;
}
