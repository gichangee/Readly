package com.ssafy.readly.dto.PhotoCard;

import com.ssafy.readly.enums.OrderType;
import com.ssafy.readly.enums.SearchType;
import com.ssafy.readly.enums.Visibility;
import lombok.Data;

@Data
public class PhotoCardSearchRequest {
    private SearchType searchType;
    private OrderType orderType;
    private int pageSize;
    private int pageNumber;
    private Visibility visibility;
}
