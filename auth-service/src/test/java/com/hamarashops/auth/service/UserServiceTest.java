package com.hamarashops.auth.service;

import com.hamarashops.auth.exception.OAuthAuthenticationException;
import com.hamarashops.auth.model.entity.User;
import com.hamarashops.auth.repository.UserRepository;
import com.hamarashops.auth.serviceimpl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    private UserRepository userRepository;
    private UserService userService;

    @BeforeEach
    public void setUp() {
        userRepository = mock(UserRepository.class);
        userService = new UserServiceImpl(userRepository);
    }

    @Test
    @DisplayName("Process new LinkedIn user registers a new account")
    public void testNewUserRegistration() {
        when(userRepository.findByLinkedinId("li_new")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User user = userService.processLinkedInUser(
                "li_new",
                "new@example.com",
                true,
                "Jane",
                "Doe",
                "Jane Doe",
                "https://example.com/pic.jpg"
        );

        assertNotNull(user);
        assertEquals("li_new", user.getLinkedinId());
        assertEquals("new@example.com", user.getEmail());
        assertEquals("Jane Doe", user.getName());
        assertEquals("ROLE_USER", user.getRole());
        assertEquals("LINKEDIN", user.getProvider());
        assertTrue(user.getEmailVerified());

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Existing LinkedIn user logs in and updates profile")
    public void testExistingLinkedInUserLogin() {
        User existing = new User("li_existing", "existing@example.com", "OldName", "User", "OldName User", null, true);
        existing.setId(10L);

        when(userRepository.findByLinkedinId("li_existing")).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User user = userService.processLinkedInUser(
                "li_existing",
                "existing@example.com",
                true,
                "NewName",
                "User",
                "NewName User",
                "https://example.com/newpic.jpg"
        );

        assertEquals(10L, user.getId());
        assertEquals("NewName User", user.getName());
        assertEquals("https://example.com/newpic.jpg", user.getPictureUrl());
        verify(userRepository, times(1)).save(existing);
    }

    @Test
    @DisplayName("Existing user by email with verified email links LinkedIn identity")
    public void testAccountLinkingWithVerifiedEmail() {
        User existingByEmail = new User(null, "shared@example.com", "Shared", "User", "Shared User", null, false);
        existingByEmail.setId(20L);

        when(userRepository.findByLinkedinId("li_match")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("shared@example.com")).thenReturn(Optional.of(existingByEmail));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User user = userService.processLinkedInUser(
                "li_match",
                "shared@example.com",
                true, // verified
                "Shared",
                "User",
                "Shared User",
                "https://example.com/pic.jpg"
        );

        assertEquals("li_match", user.getLinkedinId());
        assertTrue(user.getEmailVerified());
        verify(userRepository, times(1)).save(existingByEmail);
    }

    @Test
    @DisplayName("Unverified email cannot link to existing account")
    public void testAccountLinkingWithUnverifiedEmailFails() {
        User existingByEmail = new User("original_li", "shared@example.com", "Shared", "User", "Shared User", null, true);

        when(userRepository.findByLinkedinId("li_unverified")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("shared@example.com")).thenReturn(Optional.of(existingByEmail));

        assertThrows(OAuthAuthenticationException.class, () -> {
            userService.processLinkedInUser(
                    "li_unverified",
                    "shared@example.com",
                    false, // Unverified on LinkedIn
                    "Shared",
                    "User",
                    "Shared User",
                    null
            );
        });

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Missing sub or email throws OAuthAuthenticationException")
    public void testMissingRequiredClaimsFails() {
        assertThrows(OAuthAuthenticationException.class, () ->
                userService.processLinkedInUser(null, "a@b.com", true, "A", "B", "A B", null));
        assertThrows(OAuthAuthenticationException.class, () ->
                userService.processLinkedInUser("li_1", null, true, "A", "B", "A B", null));
    }
}
