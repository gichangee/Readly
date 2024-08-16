package com.ssafy.readly.dto.like;

import lombok.Getter;

@Getter
public class LikeRequest {
    private Integer memberId;
    private Integer reviewId;
    private Integer photoCardId;
}
