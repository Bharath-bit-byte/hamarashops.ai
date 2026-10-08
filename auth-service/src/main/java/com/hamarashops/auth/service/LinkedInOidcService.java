package com.hamarashops.auth.service;

import com.hamarashops.auth.dto.LinkedInProfile;
import com.hamarashops.auth.dto.OAuthState;

public interface LinkedInOidcService {

    OAuthState createAuthorizationRequest(String targetRedirect);

    OAuthState validateStateCookie(String cookieValue, String returnedState);

    LinkedInProfile exchangeCodeAndVerify(String code, String expectedNonce);
}
