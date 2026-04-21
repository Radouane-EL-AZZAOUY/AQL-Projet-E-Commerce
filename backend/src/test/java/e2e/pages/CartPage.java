package e2e.pages;

import e2e.config.E2eConfig;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class CartPage extends BasePage {

    private final By pageTitle = By.cssSelector("[data-testid='cart-title'], h1.page-title");
    private final By cartRows = By.cssSelector("table.table tbody tr");
    private final By checkoutLink = By.cssSelector("[data-testid='checkout-link'], a[href='#/checkout'], a[href='/checkout']");

    public CartPage(WebDriver driver, E2eConfig config) {
        super(driver, config);
    }

    public CartPage open() {
        openRoute("/cart");
        return this;
    }

    public CartPage waitUntilLoaded() {
        findVisible(pageTitle);
        waitForText(pageTitle, "Panier");
        return this;
    }

    public boolean hasItems() {
        return !driver.findElements(cartRows).isEmpty();
    }

    public CheckoutPage proceedToCheckout() {
        click(checkoutLink);
        return new CheckoutPage(driver, config).waitUntilLoaded();
    }
}
