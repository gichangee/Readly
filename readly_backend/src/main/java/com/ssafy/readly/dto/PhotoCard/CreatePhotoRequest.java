package com.ssafy.readly.dto.PhotoCard;

import com.ssafy.readly.enums.Visibility;
import lombok.Data;

@Data
public class CreatePhotoRequest {
    private int bookId;
    private String text;
    private Visibility visibility;
    private int memberId;
}
