package com.ssafy.readly.repository.mypage;

import com.ssafy.readly.dto.mypage.CompleteBookRequest;
import com.ssafy.readly.dto.mypage.GetReadBookResponse;
import com.ssafy.readly.dto.mypage.UpdateCurrentPageRequest;
import com.ssafy.readly.entity.*;

import java.util.List;

public interface MypageRepository {
    public List<ReadBook> getReadBook(int userId) throws Exception;
    public List<ReadBook> getProceedingBooks(int userId) throws Exception;
    public List<Review> getReview(int userId) throws Exception;
    public List<PhotoCard> getPhotoCard(int userId) throws Exception;
    public List<Follower> getFollower(int userId) throws Exception;
    public int updateCurrentPage(UpdateCurrentPageRequest request) throws Exception;

    void completeBook(CompleteBookRequest request) throws Exception;
}
