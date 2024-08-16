package com.ssafy.readly.service.mypage;

import com.ssafy.readly.dto.mypage.*;
import com.ssafy.readly.entity.*;
import com.ssafy.readly.repository.mypage.MypageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MypageServiceImpl implements MypageService {

    private final MypageRepository mypageRepository;


    @Override
    public List<GetReadBookResponse> getReadBook(int userId) throws Exception {
        List<ReadBook> readBooks = mypageRepository.getReadBook(userId);
        List<GetReadBookResponse> responses = new ArrayList<>();
        for(ReadBook readBook: readBooks) {
            responses.add(new GetReadBookResponse(readBook));
        }
        return responses;
    }

    @Override
    public List<GetReadBookResponse> getProceedingBooks(int userId) throws Exception {
        List<ReadBook> proceedingBooks = mypageRepository.getProceedingBooks(userId);
        List<GetReadBookResponse> responses = new ArrayList<>();
        for(ReadBook readBook: proceedingBooks) {
            responses.add(new GetReadBookResponse(readBook));
        }
        return responses;
    }

    @Override
    public List<GetMyReviewResponse> getReview(int userId) throws Exception {
        List<Review> myReviews = mypageRepository.getReview(userId);
        List<GetMyReviewResponse> responses = new ArrayList<>();
        for(Review review: myReviews) {
            responses.add(new GetMyReviewResponse(review));
        }
        return responses;
    }

    @Override
    public List<GetMyPhotocardResponse> getPhotoCard(int userId) throws Exception {
        List<PhotoCard> photoCards = mypageRepository.getPhotoCard(userId);
        List<GetMyPhotocardResponse> responses = new ArrayList<>();
        for(PhotoCard photoCard: photoCards) {
            responses.add(new GetMyPhotocardResponse(photoCard));
        }
        return responses;
    }

    @Override
    public List<GetMyFollowerResponse> getFollower(int userId) throws Exception {
        List<Follower> followers = mypageRepository.getFollower(userId);
        List<GetMyFollowerResponse> responses = new ArrayList<>();
        for(Follower follower: followers) {
            responses.add(new GetMyFollowerResponse(follower));
        }
        return responses;
    }

    @Override
    public int updateCurrentPage(UpdateCurrentPageRequest request) throws Exception {
        return mypageRepository.updateCurrentPage(request);
    }

    @Override
    public void completeBook(CompleteBookRequest request) throws Exception {
        mypageRepository.completeBook(request);
    }
}
