package e2e.tests;

import e2e.pages.LayoutPage;
import e2e.utils.AuthSession;
import e2e.utils.TestUsers;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ClientLoginFlowIT extends BaseTest {

    @Test
    void clientSession_ShowsClientNavigationOnly() {
        seedSession(AuthSession.client());

        LayoutPage layoutPage = new LayoutPage(driver, config)
                .openHome()
                .waitForAuthenticatedLayout();

        assertThat(layoutPage.currentUsername()).isEqualTo(TestUsers.CLIENT_USERNAME);
        assertThat(layoutPage.hasClientNavigation()).isTrue();
        assertThat(layoutPage.hasAdminNavigation()).isFalse();
    }
}
