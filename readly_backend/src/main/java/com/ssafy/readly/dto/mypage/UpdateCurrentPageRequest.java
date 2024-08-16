package com.ssafy.readly.dto.mypage;

import lombok.Data;

@Data
public class UpdateCurrentPageRequest {
    private int memberId;
    private int bookId;
    private int currentPage;

}
