package com.ssafy.readly.dto.review;

import com.ssafy.readly.enums.OrderType;
import com.ssafy.readly.enums.SearchType;
import com.ssafy.readly.enums.Visibility;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class ReviewSearchRequest {
    private SearchType searchType;
    private OrderType orderType;
    private int pageSize;
    private int pageNumber;
    private Visibility visibility;

}
