package e2e.tests;

import e2e.pages.AdminProductsPage;
import e2e.pages.CatalogPage;
import e2e.utils.TestUsers;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class AdminCreateProductIT extends BaseTest {

    @Test
    void adminCanCreateProductAndSeeItInCatalog() {
        requireBackendAvailable();

        String uniqueName = "E2E-Produit-" + Instant.now().toEpochMilli();

        loginViaUi(TestUsers.ADMIN_USERNAME, TestUsers.ADMIN_PASSWORD);
        assertThat(waitForJwtToken()).as("JWT token should exist after admin login").isNotBlank();
        reloadCurrentPage();

        AdminProductsPage adminProductsPage = new AdminProductsPage(driver, config)
                .open()
                .waitUntilLoaded()
                .createProduct(new AdminProductsPage.NewProductData(
                        uniqueName,
                        "Produit cree automatiquement par test E2E admin",
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
                        "199.99",
                        "12"
                ));

        assertThat(adminProductsPage.hasProductInTable(uniqueName)).isTrue();

        CatalogPage catalogPage = new CatalogPage(driver, config)
                .open()
                .waitUntilLoaded()
                .searchFor(uniqueName)
                .waitForSearchResults();

        assertThat(catalogPage.hasProductNamed(uniqueName)).isTrue();
    }
}
