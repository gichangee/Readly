package com.ssafy.readly.dto.rank;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GetRankGroupResponse {
    private int id;
    private String title;
    private Long booksReadCount;



}