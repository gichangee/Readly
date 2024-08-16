package com.ssafy.readly.dto.proceeding;


import com.ssafy.readly.entity.Proceeding;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProceedingDetailResponseDTO {
    private int proceedingId;
    private LocalDateTime createdDate;
    private String title;
    private String content;
    private int groupId;

    public static ProceedingDetailResponseDTO of(Proceeding proceeding) {
        ProceedingDetailResponseDTO responseDTO = new ProceedingDetailResponseDTO();
        responseDTO.setProceedingId(proceeding.getId());
        responseDTO.setCreatedDate(proceeding.getCreatedDate());
        responseDTO.setTitle(proceeding.getTitle());
        responseDTO.setContent(proceeding.getContent());
        responseDTO.setGroupId(proceeding.getGroup().getId());
        return responseDTO;
    }

}