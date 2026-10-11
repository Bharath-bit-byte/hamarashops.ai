package com.hamarashops.auth.service;

import com.hamarashops.auth.exception.OAuthAuthenticationException;
import com.hamarashops.auth.model.entity.User;
import com.hamarashops.auth.serviceimpl.UserServiceImpl;
import com.hamarashops.auth.storage.ExcelUserStorageService;
import com.hamarashops.auth.storage.JsonUserStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    private JsonUserStorageService jsonUserStorageService;
    private ExcelUserStorageService excelUserStorageService;
    private UserService userService;

    @BeforeEach
    public void setUp() {
        jsonUserStorageService = mock(JsonUserStorageService.class);
        excelUserStorageService = mock(ExcelUserStorageService.class);
        userService = new UserServiceImpl(jsonUserStorageService, excelUserStorageService);
    }

    @Test
    @DisplayName("Process new LinkedIn user delegates to JSON storage and synchronizes to Excel")
    public void testNewUserRegistration() {
        User createdUser = new User(
                "li_new",
                "new@example.com",
                "Jane",
                "Doe",
                "Jane Doe",
                "https://example.com/pic.jpg",
                true
        );
        createdUser.setId(1L);

        when(jsonUserStorageService.upsertUser(
                eq("li_new"),
                eq("new@example.com"),
                eq(true),
                eq("Jane"),
                eq("Doe"),
                eq("Jane Doe"),
                eq("https://example.com/pic.jpg")
        )).thenReturn(createdUser);

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

        verify(jsonUserStorageService, times(1)).upsertUser(
                "li_new", "new@example.com", true, "Jane", "Doe", "Jane Doe", "https://example.com/pic.jpg"
        );
        verify(excelUserStorageService, times(1)).syncUserToExcel(createdUser);
    }

    @Test
    @DisplayName("Existing LinkedIn user updates in JSON and synchronizes to Excel")
    public void testExistingLinkedInUserLogin() {
        User existing = new User("li_existing", "existing@example.com", "NewName", "User", "NewName User", "https://example.com/newpic.jpg", true);
        existing.setId(10L);

        when(jsonUserStorageService.upsertUser(
                eq("li_existing"),
                eq("existing@example.com"),
                eq(true),
                eq("NewName"),
                eq("User"),
                eq("NewName User"),
                eq("https://example.com/newpic.jpg")
        )).thenReturn(existing);

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
        verify(excelUserStorageService, times(1)).syncUserToExcel(existing);
    }

    @Test
    @DisplayName("Lookup methods delegate properly to JsonUserStorageService")
    public void testLookups() {
        User user = new User("li_1", "test@example.com", "A", "B", "A B", null, true);
        user.setId(5L);

        when(jsonUserStorageService.findById(5L)).thenReturn(Optional.of(user));
        when(jsonUserStorageService.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(jsonUserStorageService.findByLinkedinId("li_1")).thenReturn(Optional.of(user));

        assertTrue(userService.findById(5L).isPresent());
        assertTrue(userService.findByEmail("test@example.com").isPresent());
        assertTrue(userService.findByLinkedinId("li_1").isPresent());
    }

    @Test
    @DisplayName("processLinkedInUser with linkedinProfileUrl forwards profile URL to storage and Excel")
    public void testWithLinkedinProfileUrl() {
        User userWithUrl = new User(
                "li_url",
                "url@example.com",
                "Alice",
                "Wonder",
                "Alice Wonder",
                "https://example.com/alice.jpg",
                true
        );
        userWithUrl.setLinkedinProfileUrl("https://www.linkedin.com/in/alicewonder");
        userWithUrl.setId(20L);

        when(jsonUserStorageService.upsertUser(
                eq("li_url"),
                eq("url@example.com"),
                eq(true),
                eq("Alice"),
                eq("Wonder"),
                eq("Alice Wonder"),
                eq("https://example.com/alice.jpg"),
                eq("https://www.linkedin.com/in/alicewonder")
        )).thenReturn(userWithUrl);

        User result = userService.processLinkedInUser(
                "li_url",
                "url@example.com",
                true,
                "Alice",
                "Wonder",
                "Alice Wonder",
                "https://example.com/alice.jpg",
                "https://www.linkedin.com/in/alicewonder"
        );

        assertNotNull(result);
        assertEquals("https://www.linkedin.com/in/alicewonder", result.getLinkedinProfileUrl());
        verify(jsonUserStorageService, times(1)).upsertUser(
                "li_url", "url@example.com", true, "Alice", "Wonder", "Alice Wonder",
                "https://example.com/alice.jpg", "https://www.linkedin.com/in/alicewonder"
        );
        verify(excelUserStorageService, times(1)).syncUserToExcel(userWithUrl);
    }
}
