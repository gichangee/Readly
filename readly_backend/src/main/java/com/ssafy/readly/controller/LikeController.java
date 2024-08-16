package com.ssafy.readly.controller;

import com.ssafy.readly.dto.like.LikeRequest;
import com.ssafy.readly.service.like.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class LikeController {
    private final LikeService likeService;

    @PostMapping("/like")
    public ResponseEntity<?> like(@RequestBody LikeRequest request) {
        Long likeCount = likeService.like(request);
        return new ResponseEntity<>(likeCount, HttpStatus.OK);
    }

    @DeleteMapping("/like")
    public ResponseEntity<?> unlike(@RequestBody LikeRequest request) {
        Long likeCount = likeService.cancelLike(request);
        return new ResponseEntity<>(likeCount, HttpStatus.OK);
    }
}
