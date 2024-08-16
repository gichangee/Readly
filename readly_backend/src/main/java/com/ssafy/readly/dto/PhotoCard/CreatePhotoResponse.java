package com.ssafy.readly.dto.PhotoCard;

import lombok.Data;

import java.util.List;

@Data
public class CreatePhotoResponse {
    int PhotoCardId;
    List<String> Images;
}
