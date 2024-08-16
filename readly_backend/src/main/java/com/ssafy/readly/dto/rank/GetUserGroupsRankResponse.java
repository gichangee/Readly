package com.ssafy.readly.dto.rank;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GetUserGroupsRankResponse {
    private int groupId;
    private String groupName;
    private Long readBookCount;
    private int rank;
}
