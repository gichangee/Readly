package com.ssafy.readly.service.group;

import com.ssafy.readly.dto.group.GetGroupResponse;
import com.ssafy.readly.dto.group.MakeGroupRequest;
import com.ssafy.readly.entity.Group;

import java.util.List;

public interface GroupService {
    String makeGroup(MakeGroupRequest makeGroupRequest) throws  Exception;

    void updateRoomId(String groupId, String roomId) throws  Exception;

    List<GetGroupResponse> findAllGroup() throws  Exception;

    void joinGroup(int groupId, int memberId) throws  Exception;

    List<GetGroupResponse> findGroupsByMemberId(int memberId) throws  Exception;

    void deleteGroup(int groupId) throws  Exception;

    void leaveGroup(int groupId, int memberId) throws  Exception;
}
