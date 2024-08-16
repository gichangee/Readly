package com.ssafy.readly.dto.review;

import com.ssafy.readly.enums.Visibility;
import lombok.Data;

@Data
public class ReviewRequest {
    private int memberId;
    private int bookId;
    private String text;
    private Visibility visibility;
}
