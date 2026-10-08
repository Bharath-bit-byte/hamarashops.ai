package com.hamarashops.auth.repository;

import com.hamarashops.auth.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByLinkedinId(String linkedinId);

    Optional<User> findByEmail(String email);

    boolean existsByLinkedinId(String linkedinId);

    boolean existsByEmail(String email);
}
