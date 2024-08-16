package com.ssafy.readly.service.photocard;

import com.ssafy.readly.dto.PhotoCard.CreatePhotoCardRequest;
import com.ssafy.readly.dto.PhotoCard.CreatePhotoCardResponse;
import com.ssafy.readly.dto.PhotoCard.PhotoCardSearchRequest;
import com.ssafy.readly.entity.PhotoCard;
import com.ssafy.readly.enums.Visibility;
import com.ssafy.readly.repository.photocard.PhotoCardQueryDSLRepository;
import com.ssafy.readly.repository.photocard.PhotoCardRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class PhotoCardServiceImpl implements PhotoCardService{

    private final PhotoCardQueryDSLRepository photoCardRepositoryImpl;

    private final PhotoCardRepository photoCardRepository;

    @Override
    public int addPhotoCard(PhotoCard photoCard) throws Exception {
        return photoCardRepositoryImpl.addPhotoCard(photoCard);
    }

    @Override
    public CreatePhotoCardResponse createPhotoCard(CreatePhotoCardRequest request) throws Exception {
        // 포토카드 생성
        photoCardRepositoryImpl.updatePhotoCard(request);
        // 후 유저정보,포토카드 정보, 책 정보중 원하는 데이터만 추출해 반환
        return photoCardRepositoryImpl.getPhotoCard(request.getPhotoCardId());
    }

    @Override
    public CreatePhotoCardResponse findPhotoCardById(int id) throws Exception {
        return photoCardRepositoryImpl.getPhotoCard(id);
    }

    /**
     * @param request
     * @return
     * @throws Exception
     */
    @Override
    public List<CreatePhotoCardResponse> findPhotoCardsSorted(PhotoCardSearchRequest request) throws Exception {

        return photoCardRepositoryImpl.findPhotoCardsSorted(request);
    }

    @Override
    public long getPhotoCardsCount(Visibility visibility){
        return photoCardRepositoryImpl.getPhotoCardCount(visibility);
    }

    /**
     * @param loginId
     * @return
     * @throws Exception
     */
    @Override
    public List<CreatePhotoCardResponse> findPhotoCardsByLoginId(int loginId) throws Exception {
        return photoCardRepositoryImpl.findPhotoCardsbyMemberId(loginId);
    }

    /**
     * @param bookId
     * @return
     */
    @Override
    public CreatePhotoCardResponse findPhotoCardForBookSearch(int bookId) {
        return photoCardRepositoryImpl.findPhotoCardForBookSearch(bookId);
    }
}
