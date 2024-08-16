package com.ssafy.readly.dto.rank;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GetRankUserResponse {
    private int id;
    private String memberName;
    private Long booksReadCount;

}