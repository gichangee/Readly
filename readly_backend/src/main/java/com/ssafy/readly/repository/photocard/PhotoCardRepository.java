package com.ssafy.readly.repository.photocard;


import com.ssafy.readly.entity.PhotoCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PhotoCardRepository extends JpaRepository<PhotoCard, Integer> {
}
