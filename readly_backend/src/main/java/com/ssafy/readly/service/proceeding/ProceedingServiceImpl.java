package com.ssafy.readly.service.proceeding;

import com.ssafy.readly.dto.proceeding.ProceedingCreateRequestDTO;
import com.ssafy.readly.dto.proceeding.ProceedingUpdateRequestDTO;
import com.ssafy.readly.entity.Proceeding;

import com.ssafy.readly.repository.proceeding.ProceedingRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ProceedingServiceImpl implements ProceedingService {

    private final ProceedingRepository proceedingRepository;

    @Override
    public List<Proceeding> getProceedingsByGroupId(int groupId, int pageSize, int pageNumber) throws Exception {
        return proceedingRepository.getProceedingsByGroupId(groupId,pageSize,pageNumber);
    }

    @Override
    public long countProceedingsByGroupId(int groupId) throws Exception {
        return proceedingRepository.countProceedingsByGroupId(groupId);
    }

    @Override
    public Proceeding getProceedingById(int id) throws Exception {
        return  proceedingRepository.getProceedingById(id);
    }

    @Override
    public Proceeding createProceeding(ProceedingCreateRequestDTO requestDTO) throws Exception {
        return  proceedingRepository.createProceeding(requestDTO);
    }

    @Override
    public Proceeding updateProceeding(int proceedingId, ProceedingUpdateRequestDTO requestDTO) throws Exception {
        return  proceedingRepository.updateProceeding(proceedingId,requestDTO);
    }

    @Override
    public void deleteProceeding(int proceedingId) throws Exception {
        proceedingRepository.deleteProceeding(proceedingId);
    }

}
