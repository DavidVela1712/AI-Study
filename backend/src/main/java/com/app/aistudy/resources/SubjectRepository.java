package com.app.aistudy.resources;

import com.app.aistudy.model.Subject;
import com.app.aistudy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Integer> {

    List<Subject> findByUser(User user);

    boolean existsByUserAndName(User user, String name);

    boolean existsByUserAndNameAndIdSubjectNot(User user, String name, Integer idSubject);
}
