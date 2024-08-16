package com.ssafy.readly.repository.group;

import com.ssafy.readly.dto.group.GetGroupResponse;
import com.ssafy.readly.dto.group.MakeGroupRequest;
import com.ssafy.readly.entity.*;
import com.ssafy.readly.enums.IsInviting;
import com.ssafy.readly.enums.ReadType;
import com.ssafy.readly.enums.Role;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class GroupRepositoryImpl implements GroupRepository{
    private final EntityManager em;
    @Override
    public String makeGroup(MakeGroupRequest makeGroupRequest) {
        // Determine the initial value of isInviting based on maxParticipants
        IsInviting isInviting = makeGroupRequest.getMaxParticipants() == 1 ? IsInviting.r : IsInviting.a;

        // Create and persist the Group entity
        Group group = new Group(
                makeGroupRequest.getTitle(),
                makeGroupRequest.getDescription(),
                makeGroupRequest.getCreatedDate(),
                makeGroupRequest.getMaxParticipants(),
                makeGroupRequest.getRoomId(),
                isInviting // Set isInviting based on the condition
        );
        em.persist(group);
        em.flush();

        Member member = em.createQuery("SELECT m FROM Member m WHERE m.id = :memberId", Member.class)
                .setParameter("memberId", makeGroupRequest.getMemberId())
                .getSingleResult();

        // Add the creator to the group_members table with role 'L'
        GroupMember groupMember = new GroupMember(
                Role.L,
                member,
                group
        );
        em.persist(groupMember);

        // Ensure the relationship is set correctly
        member.getGroupMembers().add(groupMember);
        group.getGroupMembers().add(groupMember);

        // Process tags
        Set<GroupTag> groupTags = new HashSet<>();
        for (String tagName : makeGroupRequest.getTags()) {
            // Fetch or create Tag entity
            Tag tag = em.createQuery("SELECT t FROM Tag t WHERE t.name = :name", Tag.class)
                    .setParameter("name", tagName)
                    .getResultStream()
                    .findFirst()
                    .orElse(new Tag(tagName));

            if (tag.getId() == null) {
                em.persist(tag);
                em.flush(); // Ensure tag is saved to get the ID
            }

            // Create and add GroupTag to the set
            GroupTag groupTag = new GroupTag(group, tag);
            groupTags.add(groupTag);
        }

        // Set GroupTags for the Group
        for (GroupTag groupTag : groupTags) {
            group.addGroupTag(groupTag); // Add tags using Group's method
        }

        return String.valueOf(group.getId());
    }


    public void updateRoomId(String groupId, String roomId) {
        Group group = em.find(Group.class, Long.parseLong(groupId));
        if (group != null) {
            group.updateRoomId(roomId);
        }
    }

    @Override
    public List<GetGroupResponse> findAllGroup() throws Exception {
        // Add a condition to the JPQL query to only fetch groups where is_inviting is 'a'
        String jpql = "SELECT g FROM Group g LEFT JOIN FETCH g.groupTags gt LEFT JOIN FETCH gt.tag WHERE g.isInviting = :isInviting";
        TypedQuery<Group> query = em.createQuery(jpql, Group.class);
        query.setParameter("isInviting", IsInviting.a); // Set the parameter for the isInviting condition

        List<Group> groups = query.getResultList();

        return groups.stream()
                .map(group -> {
                    // Extract tags
                    Set<String> tags = group.getGroupTags().stream()
                            .map(gt -> gt.getTag().getName())
                            .collect(Collectors.toSet());

                    // Create and return response
                    return new GetGroupResponse(
                            group.getId(),
                            group.getTitle(),
                            group.getDescription(),
                            group.getCreatedDate(),
                            group.getMaxParticipants(),
                            group.getCurrentParticipants(),
                            tags
                    );
                })
                .collect(Collectors.toList());
    }


    @Override
    public void joinGroup(int groupId, int memberId) throws Exception {
        Group group = em.find(Group.class, groupId);
        if (group == null) {
            throw new IllegalArgumentException("Group not found");
        }

        Member member = em.find(Member.class, memberId);
        if (member == null) {
            throw new IllegalArgumentException("Member not found");
        }


        // GroupMember 존재 여부 확인
        TypedQuery<GroupMember> query = em.createQuery(
                "SELECT gm FROM GroupMember gm WHERE gm.group.id = :groupId AND gm.member.id = :memberId",
                GroupMember.class
        );
        query.setParameter("groupId", groupId);
        query.setParameter("memberId", memberId);

        List<GroupMember> existingGroupMembers = query.getResultList();
        if (!existingGroupMembers.isEmpty()) {
            throw new IllegalArgumentException("Member is already part of the group");
        }

        try {
            group.setCurrentParticipants(); // 현재 인원수 업데이트 및 최대 인원수 도달 시 isInviting 값 변경
        } catch (IllegalStateException e) {
            throw new IllegalArgumentException(e.getMessage());
        }

        GroupMember groupMember = new GroupMember(Role.M, member, group);
        em.persist(groupMember);

        // Add the member to the ReadBook entry with readType "R" for the group
        TypedQuery<ReadBook> readBookQuery = em.createQuery(
                "SELECT rb FROM ReadBook rb WHERE rb.group.id = :groupId AND rb.readType = :readType",
                ReadBook.class
        );
        readBookQuery.setParameter("groupId", groupId);
        readBookQuery.setParameter("readType", ReadType.R);

        // Assuming there is only one result as per the group constraint
        ReadBook readBook = readBookQuery.getResultStream().findFirst().orElse(null);
        if (readBook != null) {
            ReadBook newReadBook = new ReadBook();
            newReadBook.addBook(readBook.getBook());
            newReadBook.addGroup(group);
            newReadBook.addMember(member);
            newReadBook.setCurrentPage(0); // Assuming the new member starts reading from page 0
            newReadBook.setReadType(ReadType.R);
            em.persist(newReadBook);
        }
    }

    @Override
    public List<GetGroupResponse> findGroupsByMemberId(int memberId) {
        List<GroupMember> groupMembers = em.createQuery(
                        "SELECT gm FROM GroupMember gm WHERE gm.member.id = :memberId", GroupMember.class)
                .setParameter("memberId", memberId)
                .getResultList();

        return groupMembers.stream()
                .map(gm -> {
                    GetGroupResponse response = new GetGroupResponse();
                    response.setGroupId(gm.getGroup().getId());
                    response.setTitle(gm.getGroup().getTitle());
                    response.setDescription(gm.getGroup().getDescription());
                    response.setCreatedDate(gm.getGroup().getCreatedDate());
                    response.setMaxParticipants(gm.getGroup().getMaxParticipants());
                    response.setCurrentParticipants(gm.getGroup().getCurrentParticipants());
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    public void deleteGroup(int groupId) {
        Group group = em.find(Group.class, groupId);
        if (group != null) {
            em.remove(group);
        } else {
            throw new IllegalArgumentException("Group not found");
        }
    }

    @Override
    public void leaveGroup(int groupId, int memberId) {
        GroupMember groupMember = em.createQuery("SELECT gm FROM GroupMember gm WHERE gm.group.id = :groupId AND gm.member.id = :memberId", GroupMember.class)
                .setParameter("groupId", groupId)
                .setParameter("memberId", memberId)
                .getSingleResult();

        if (groupMember != null) {
            Group group = groupMember.getGroup();
            group.decrementCurrentParticipants(); // 현재 인원수 감소

            group.getGroupMembers().remove(groupMember);
            groupMember.getMember().getGroupMembers().remove(groupMember);
            em.remove(groupMember);
        } else {
            throw new IllegalArgumentException("GroupMember not found");
        }
    }
}
