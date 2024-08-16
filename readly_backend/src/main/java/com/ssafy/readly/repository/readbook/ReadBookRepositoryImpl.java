package com.ssafy.readly.repository.readbook;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.readly.dto.readbook.ReadBookGroupRequestDTO;
import com.ssafy.readly.dto.readbook.ReadBookRequestDTO;
import com.ssafy.readly.dto.readbook.UpdateReadBookPageRequestDTO;
import com.ssafy.readly.entity.Book;
import com.ssafy.readly.entity.GroupMember;
import com.ssafy.readly.entity.Member;
import com.ssafy.readly.entity.ReadBook;
import com.ssafy.readly.enums.ReadType;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class ReadBookRepositoryImpl implements ReadBookRepository{

    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    @Override
    public void addUserReadBook(ReadBookRequestDTO readBookRequestDTO) {
        int memberId = readBookRequestDTO.getMemberId();
        int bookId = readBookRequestDTO.getBookId();

        Member member = em.find(Member.class, memberId);
        Book book = em.find(Book.class, bookId);

        if (member == null) {
            throw new IllegalArgumentException("잘못된 멤버 ID입니다.");
        }

        if (book == null) {
            throw new IllegalArgumentException("잘못된 책 ID입니다.");
        }

        // Check for existing ReadBook entry
        TypedQuery<ReadBook> query = em.createQuery(
                "SELECT rb FROM ReadBook rb WHERE rb.member.id = :memberId AND rb.book.id = :bookId", ReadBook.class);
        query.setParameter("memberId", memberId);
        query.setParameter("bookId", bookId);
        List<ReadBook> existingReadBooks = query.getResultList();

        if (existingReadBooks.isEmpty()) {
            ReadBook readBook = new ReadBook();
            readBook.addMember(member);
            readBook.addBook(book);
            readBook.setCurrentPage(0);
            readBook.setReadType(ReadType.R); // 기본값으로 설정하지만 명시적으로 설정해 줍니다.

            em.persist(readBook);
        }
    }

    @Override
    public void addGroupReadBook(ReadBookGroupRequestDTO readBookGroupRequestDTO){
        int groupId = readBookGroupRequestDTO.getGroupId();
        int bookId = readBookGroupRequestDTO.getBookId();
        int oldBookId = readBookGroupRequestDTO.getOldBookId();

        // Update readType to 'D' for matching records
        TypedQuery<ReadBook> updateQuery = em.createQuery("SELECT rb FROM ReadBook rb WHERE rb.group.id = :groupId AND rb.book.id = :oldBookId", ReadBook.class);
        updateQuery.setParameter("groupId", groupId);
        updateQuery.setParameter("oldBookId", oldBookId);
        List<ReadBook> readBooksToUpdate = updateQuery.getResultList();

        for (ReadBook readBook : readBooksToUpdate) {
            readBook.setReadType(ReadType.D);
            em.merge(readBook);
        }

        TypedQuery<GroupMember> query = em.createQuery("SELECT gm FROM GroupMember gm WHERE gm.group.id = :groupId", GroupMember.class);
        query.setParameter("groupId", groupId);
        List<GroupMember> groupMembers = query.getResultList();

        Book book = em.find(Book.class, bookId);

        if (book == null) {
            throw new IllegalArgumentException("Invalid book ID");
        }

        for (GroupMember groupMember : groupMembers) {
            // Check for existing ReadBook entry
            TypedQuery<ReadBook> existingQuery = em.createQuery(
                    "SELECT rb FROM ReadBook rb WHERE rb.member.id = :memberId AND rb.book.id = :bookId AND rb.group.id = :groupId", ReadBook.class);
            existingQuery.setParameter("memberId", groupMember.getMember().getId());
            existingQuery.setParameter("bookId", bookId);
            existingQuery.setParameter("groupId", groupId);
            List<ReadBook> existingReadBooks = existingQuery.getResultList();

            if (existingReadBooks.isEmpty()) {
                ReadBook readBook = new ReadBook();
                readBook.addMember(groupMember.getMember());
                readBook.addBook(book);
                readBook.setCurrentPage(0);
                readBook.addGroup(groupMember.getGroup());  // 그룹 설정 추가
                readBook.setReadType(ReadType.R); // 기본값으로 설정하지만 명시적으로 설정해 줍니다.
                em.persist(readBook);
            }
        }
    }


    @Override
    public ResponseEntity<?> findReadBooksByGroupId(int groupId) {
        Map<String, Object> response = new HashMap<>();

        TypedQuery<ReadBook> query = em.createQuery("SELECT rb FROM ReadBook rb WHERE rb.group.id = :groupId AND rb.readType = :readType", ReadBook.class);
        query.setParameter("groupId", groupId);
        query.setParameter("readType", ReadType.R);
        List<ReadBook> readBooks = query.getResultList();

        // Collecting the required data
        List<Map<String, Object>> readBooksData = readBooks.stream().map(rb -> {
            Map<String, Object> data = new HashMap<>();
            data.put("id", rb.getId());
            data.put("member_id", rb.getMember().getId());
            data.put("book_id", rb.getBook().getId());
            data.put("currentPage", rb.getCurrentPage());
            data.put("read_type", rb.getReadType());
            data.put("group_id", rb.getGroup().getId());

            // Fetch additional member information
            Member member = em.find(Member.class, rb.getMember().getId());
            Map<String, Object> memberInfo = new HashMap<>();
            memberInfo.put("member_id", member.getId());
            memberInfo.put("member_name", member.getMemberName());  // Assuming `name` is a field in `Member` entity

            // Fetch the role of the member in the group
            TypedQuery<GroupMember> groupMemberQuery = em.createQuery(
                    "SELECT gm FROM GroupMember gm WHERE gm.group.id = :groupId AND gm.member.id = :memberId", GroupMember.class);
            groupMemberQuery.setParameter("groupId", groupId);
            groupMemberQuery.setParameter("memberId", rb.getMember().getId());
            List<GroupMember> groupMembers = groupMemberQuery.getResultList();

            // Assuming only one role per member per group
            if (!groupMembers.isEmpty()) {
                memberInfo.put("roles", groupMembers.get(0).getRole().toString());
            } else {
                memberInfo.put("roles", null);
            }



            data.put("member_info", memberInfo);
            return data;
        }).collect(Collectors.toList());

        // Collect book information
        Map<String, Object> bookInfo = new HashMap<>();
        if (!readBooks.isEmpty()) {
            Book book = em.find(Book.class, readBooks.get(0).getBook().getId());
            bookInfo.put("book_id", book.getId());
            bookInfo.put("book_title", book.getTitle()); // Assuming `title` is a field in `Book` entity
            bookInfo.put("book_author", book.getAuthor()); // Assuming `author` is a field in `Book` entity
            bookInfo.put("book_totalPage",book.getTotalPage());
            bookInfo.put("book_image",book.getImage());
        }

        response.put("readBooks", readBooksData);
        response.put("bookInfo", bookInfo);

        return ResponseEntity.ok(response);
    }


    @Override
    public void updateUserReadBookPage(UpdateReadBookPageRequestDTO updateReadBookPageRequestDTO) {
        int memberId = updateReadBookPageRequestDTO.getMemberId();
        int bookId = updateReadBookPageRequestDTO.getBookId();
        int currentPage = updateReadBookPageRequestDTO.getCurrentPage();

        TypedQuery<ReadBook> query = em.createQuery(
                "SELECT rb FROM ReadBook rb WHERE rb.member.id = :memberId AND rb.book.id = :bookId", ReadBook.class);
        query.setParameter("memberId", memberId);
        query.setParameter("bookId", bookId);
        List<ReadBook> readBooks = query.getResultList();

        if (readBooks.isEmpty()) {
            throw new IllegalArgumentException("해당 멤버와 책에 대한 읽기 기록이 존재하지 않습니다.");
        }

        ReadBook readBook = readBooks.get(0); // Assuming one record per member-book pair
        readBook.setCurrentPage(currentPage);

        em.merge(readBook);
    }
}
