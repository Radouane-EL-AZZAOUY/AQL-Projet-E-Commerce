package e2e.tests;

import e2e.pages.LayoutPage;
import e2e.utils.AuthSession;
import e2e.utils.TestUsers;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AdminLoginFlowIT extends BaseTest {

    @Test
    void adminSession_ShowsAdminNavigation() {
        seedSession(AuthSession.admin());

        LayoutPage layoutPage = new LayoutPage(driver, config)
                .openHome()
                .waitForAuthenticatedLayout();

        assertThat(layoutPage.currentUsername()).isEqualTo(TestUsers.ADMIN_USERNAME);
        assertThat(layoutPage.hasClientNavigation()).isTrue();
        assertThat(layoutPage.hasAdminNavigation()).isTrue();
    }
}
