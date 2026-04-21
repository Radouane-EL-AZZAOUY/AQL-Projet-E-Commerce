package e2e.utils;

public record AuthSession(Long userId, String username, String role, String token) {

    public static AuthSession client() {
        return new AuthSession(2L, TestUsers.CLIENT_USERNAME, "CLIENT", "e2e-client-token");
    }

    public static AuthSession admin() {
        return new AuthSession(1L, TestUsers.ADMIN_USERNAME, "ADMIN", "e2e-admin-token");
    }
}
