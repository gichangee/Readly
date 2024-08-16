package com.ssafy.readly.service.mypage;

import com.ssafy.readly.dto.mypage.*;
import com.ssafy.readly.entity.Follower;
import com.ssafy.readly.entity.PhotoCard;
import com.ssafy.readly.entity.Review;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface MypageService {
    public List<GetReadBookResponse> getReadBook(int userId) throws Exception;
    public List<GetReadBookResponse> getProceedingBooks(int userId) throws Exception;
    public List<GetMyReviewResponse> getReview(int userId) throws Exception;
    public List<GetMyPhotocardResponse> getPhotoCard(int userId) throws Exception;
    public List<GetMyFollowerResponse> getFollower(int userId) throws Exception;
    public int updateCurrentPage(UpdateCurrentPageRequest request) throws Exception;
    void completeBook(CompleteBookRequest request) throws Exception;
}
