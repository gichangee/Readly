package com.ssafy.readly.dto.PhotoCard;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreatePhotoCardRequest {
    private String imageLink;
    private int photoCardId;
}
