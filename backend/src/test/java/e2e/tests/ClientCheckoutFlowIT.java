package e2e.tests;

import e2e.pages.CartPage;
import e2e.pages.CatalogPage;
import e2e.pages.CheckoutPage;
import e2e.pages.HomePage;
import e2e.pages.OrderDetailPage;
import e2e.pages.ProductDetailPage;
import e2e.utils.TestUsers;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ClientCheckoutFlowIT extends BaseTest {

    @Test
    void clientCanBrowseAddToCartAndPlaceOrder() {
        requireBackendAvailable();

        HomePage homePage = new HomePage(driver, config).open();
        assertThat(homePage.isLoaded()).isTrue();

        loginViaUi(TestUsers.CLIENT_USERNAME, TestUsers.CLIENT_PASSWORD);
        assertThat(waitForJwtToken()).isNotBlank();
        reloadCurrentPage();

        CatalogPage catalogPage = new CatalogPage(driver, config)
                .open()
                .waitUntilLoaded()
                .waitForProducts();
        assertThat(catalogPage.hasProducts()).isTrue();

        ProductDetailPage productPage = catalogPage.openFirstProduct();
        productPage.addToCart(1);

        CartPage cartPage = new CartPage(driver, config)
                .open()
                .waitUntilLoaded()
                .waitUntilHasItems();
        assertThat(cartPage.hasItems()).isTrue();

        CheckoutPage checkoutPage = cartPage.proceedToCheckout();
        OrderDetailPage orderDetailPage = checkoutPage.placeOrder();

        assertThat(orderDetailPage.getOrderTitle()).contains("Commande #");
        assertThat(orderDetailPage.isOrderConfirmed()).isTrue();
    }
}
