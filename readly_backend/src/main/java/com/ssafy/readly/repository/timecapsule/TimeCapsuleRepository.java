package com.ssafy.readly.repository.timecapsule;

import com.ssafy.readly.dto.timecapsule.TimeCapsuleAlarmResponse;
import com.ssafy.readly.dto.timecapsule.TimeCapsuleDateResponse;
import com.ssafy.readly.entity.TimeCapsule;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TimeCapsuleRepository {
    void saveTimeCapsule(TimeCapsule timeCapsule);
    Optional<TimeCapsule> findById(Integer timeCapsuleId);
    List<TimeCapsuleAlarmResponse> findTimeCapsuleAlarms(Integer memberId, LocalDate date);
    Long findTimeCapsuleAlarmsCount(Integer memberId, LocalDate date);
    TimeCapsuleDateResponse findSelectedDateById(Integer timeCapsuleId);
    void delete(TimeCapsule timeCapsule);
}
