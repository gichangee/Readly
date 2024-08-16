package com.ssafy.readly.service.like;

import com.ssafy.readly.dto.like.LikeRequest;

public interface LikeService {
    Long like(LikeRequest likeRequest);
    Long cancelLike(LikeRequest likeRequest);
}
