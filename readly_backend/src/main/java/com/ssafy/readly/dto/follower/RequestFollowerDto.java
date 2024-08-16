package com.ssafy.readly.dto.follower;

import lombok.Data;

@Data
public class RequestFollowerDto {
    private int memberId;
    private int followerMemberId;
}
