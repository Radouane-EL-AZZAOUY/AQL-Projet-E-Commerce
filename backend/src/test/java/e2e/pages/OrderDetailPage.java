package e2e.pages;

import e2e.config.E2eConfig;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class OrderDetailPage extends BasePage {

    private final By orderTitle = By.cssSelector("[data-testid='order-title'], h1.page-title");
    private final By orderStatus = By.cssSelector("[data-testid='order-status'], .badge");

    public OrderDetailPage(WebDriver driver, E2eConfig config) {
        super(driver, config);
    }

    public OrderDetailPage waitUntilLoaded() {
        waitForUrlOrHashContains("/orders/");
        findVisible(orderTitle);
        waitForText(orderTitle, "Commande #");
        return this;
    }

    public String getOrderTitle() {
        return findVisible(orderTitle).getText().trim();
    }

    public String getStatusText() {
        return findVisible(orderStatus).getText().trim();
    }

    public boolean isOrderConfirmed() {
        String statusText = getStatusText();
        return "Validée".equalsIgnoreCase(statusText) || "CONFIRMED".equalsIgnoreCase(statusText);
    }
}
