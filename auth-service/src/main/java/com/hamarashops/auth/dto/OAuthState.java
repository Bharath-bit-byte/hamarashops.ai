package com.hamarashops.auth.dto;

public class OAuthState {

    private String state;
    private String nonce;
    private String targetRedirect;
    private String authUrl;
    private String cookieValue;

    public OAuthState() {
    }

    public OAuthState(String state, String nonce, String targetRedirect, String authUrl, String cookieValue) {
        this.state = state;
        this.nonce = nonce;
        this.targetRedirect = targetRedirect;
        this.authUrl = authUrl;
        this.cookieValue = cookieValue;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getNonce() {
        return nonce;
    }

    public void setNonce(String nonce) {
        this.nonce = nonce;
    }

    public String getTargetRedirect() {
        return targetRedirect;
    }

    public void setTargetRedirect(String targetRedirect) {
        this.targetRedirect = targetRedirect;
    }

    public String getAuthUrl() {
        return authUrl;
    }

    public void setAuthUrl(String authUrl) {
        this.authUrl = authUrl;
    }

    public String getCookieValue() {
        return cookieValue;
    }

    public void setCookieValue(String cookieValue) {
        this.cookieValue = cookieValue;
    }
}
