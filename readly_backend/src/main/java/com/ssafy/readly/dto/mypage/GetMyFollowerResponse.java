package com.ssafy.readly.dto.mypage;

import com.ssafy.readly.entity.Follower;
import lombok.Data;

@Data
public class GetMyFollowerResponse {
    private int followedId;
    private String followedName;
    private int followedPoint;
    private String followedText;

    public GetMyFollowerResponse(Follower follower){
        this.followedId = follower.getFollowed().getId();
        this.followedName= follower.getFollowed().getNickname();
        this.followedPoint = follower.getFollowed().getPoint();
        this.followedText = follower.getFollowed().getIntroduction();

    }
}
