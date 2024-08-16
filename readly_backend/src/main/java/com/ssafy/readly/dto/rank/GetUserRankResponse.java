package com.ssafy.readly.dto.rank;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GetUserRankResponse {
    private int id;
    private String memberName;
    private Long readBookCount;
    private int rank;

    public GetUserRankResponse(int id, String memberName, Long readBookCount) {
        this.id = id;
        this.memberName = memberName;
        this.readBookCount = readBookCount;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }
}