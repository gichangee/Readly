package com.ssafy.readly.service.readbook;

import com.ssafy.readly.dto.readbook.ReadBookGroupRequestDTO;
import com.ssafy.readly.dto.readbook.ReadBookRequestDTO;
import com.ssafy.readly.dto.readbook.UpdateReadBookPageRequestDTO;
import org.springframework.http.ResponseEntity;

public interface ReadBookService {
    void addUserReadBook(ReadBookRequestDTO readBookRequestDTO) throws Exception;

    void addGroupReadBook(ReadBookGroupRequestDTO readBookGroupRequestDTO) throws Exception;

    ResponseEntity<?> findReadBooksByGroupId(int groupId) throws Exception;

    void updateUserReadBookPage(UpdateReadBookPageRequestDTO updateReadBookPageRequestDTO) throws Exception;
}
