package com.ssafy.readly.service.group;


import com.ssafy.readly.dto.group.GetGroupResponse;
import com.ssafy.readly.dto.group.MakeGroupRequest;
import com.ssafy.readly.entity.Group;
import com.ssafy.readly.repository.group.GroupRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService{
    private final GroupRepository groupRepository;

    @Override
    public String makeGroup(MakeGroupRequest makeGroupRequest) throws Exception {
        return  groupRepository.makeGroup(makeGroupRequest);
    }

    @Override
    public void updateRoomId(String groupId, String roomId) throws Exception {
        groupRepository.updateRoomId(groupId,roomId);
    }

    @Override
    public List<GetGroupResponse> findAllGroup() throws Exception {
        return groupRepository.findAllGroup();
    }

    @Override
    public void joinGroup(int groupId, int memberId) throws Exception {
        groupRepository.joinGroup(groupId, memberId) ;
    }

    @Override
    public List<GetGroupResponse> findGroupsByMemberId(int memberId) throws Exception {
        return groupRepository.findGroupsByMemberId(memberId);
    }

    @Override
    public void deleteGroup(int groupId) throws Exception {
        groupRepository.deleteGroup(groupId) ;
    }

    @Override
    public void leaveGroup(int groupId, int memberId) throws Exception {
        groupRepository.leaveGroup(groupId,memberId) ;
    }


}
