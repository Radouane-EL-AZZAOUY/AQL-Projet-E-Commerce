package e2e.pages;

import e2e.config.E2eConfig;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class CheckoutPage extends BasePage {

    private final By pageTitle = By.cssSelector("[data-testid='checkout-title'], h1.page-title");
    private final By confirmButton = By.cssSelector("[data-testid='confirm-order'], button.btn.btn-primary");

    public CheckoutPage(WebDriver driver, E2eConfig config) {
        super(driver, config);
    }

    public CheckoutPage waitUntilLoaded() {
        waitForUrlOrHashContains("/checkout");
        findVisible(pageTitle);
        waitForText(pageTitle, "Valider la commande");
        return this;
    }

    public OrderDetailPage placeOrder() {
        click(confirmButton);
        return new OrderDetailPage(driver, config).waitUntilLoaded();
    }
}
