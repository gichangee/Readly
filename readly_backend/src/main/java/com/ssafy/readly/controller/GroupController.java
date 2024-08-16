package com.ssafy.readly.controller;

import com.ssafy.readly.dto.group.GetGroupResponse;
import com.ssafy.readly.dto.group.JoinGroupRequest;
import com.ssafy.readly.dto.group.MakeGroupRequest;
import com.ssafy.readly.service.group.GroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class GroupController {

    private final GroupService groupService;

    @PostMapping("/makegroup")
    public ResponseEntity<?> makeGroup(@RequestBody MakeGroupRequest makeGroupRequest) throws Exception {

        String groupId = groupService.makeGroup(makeGroupRequest);
        groupService.updateRoomId(groupId, groupId);  // Use groupId directly as roomId

        return new ResponseEntity<>(HttpStatus.CREATED); // 201 Created 상태 코드로 변경
    }


    @GetMapping("/groups")
    public ResponseEntity<?> findAllGroup() throws Exception {
        // 모든 소모임 정보를 가져옵니다.
        List<GetGroupResponse> allGroup = groupService.findAllGroup();

        // 소모임 정보가 존재하는지 확인합니다.
        if (allGroup != null && !allGroup.isEmpty()) {
            return new ResponseEntity<>(allGroup, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @PostMapping("/joingroup")
    public ResponseEntity<?> joinGroup(@RequestBody JoinGroupRequest joinGroupRequest)  throws Exception {
        try {
            groupService.joinGroup(joinGroupRequest.getGroupId(), joinGroupRequest.getMemberId());
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/membergroups/{memberId}")
    public ResponseEntity<List<GetGroupResponse>> getGroupsByMemberId(@PathVariable("memberId") int memberId) throws Exception {
        List<GetGroupResponse> groups = groupService.findGroupsByMemberId(memberId);
        if (groups.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(groups, HttpStatus.OK);
    }

    @DeleteMapping("/group/{groupId}")
    public ResponseEntity<?> deleteGroup(@PathVariable int groupId)  throws Exception {
        try {
            groupService.deleteGroup(groupId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/group/{groupId}/member/{memberId}")
    public ResponseEntity<?> leaveGroup(@PathVariable int groupId, @PathVariable int memberId)  throws Exception {
        try {
            groupService.leaveGroup(groupId, memberId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
