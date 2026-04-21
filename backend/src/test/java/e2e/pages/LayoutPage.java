package e2e.pages;

import e2e.config.E2eConfig;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LayoutPage extends BasePage {

    private final By userBadge = By.cssSelector(".nav-user");
    private final By cartLink = By.cssSelector("a[href='#/cart'], a[href='/cart']");
    private final By ordersLink = By.cssSelector("a[href='#/orders'], a[href='/orders']");
    private final By adminProductsLink = By.cssSelector("a[href='#/admin/products'], a[href='/admin/products']");
    private final By adminCategoriesLink = By.cssSelector("a[href='#/admin/categories'], a[href='/admin/categories']");
    private final By adminOrdersLink = By.cssSelector("a[href='#/admin/orders'], a[href='/admin/orders']");

    public LayoutPage(WebDriver driver, E2eConfig config) {
        super(driver, config);
    }

    public LayoutPage openHome() {
        openRoute("/");
        return this;
    }

    public LayoutPage waitForAuthenticatedLayout() {
        findPresent(userBadge);
        return this;
    }

    public String currentUsername() {
        String text = findPresent(userBadge).getDomProperty("textContent");
        return text == null ? "" : text.trim();
    }

    public boolean hasClientNavigation() {
        return !driver.findElements(cartLink).isEmpty() && !driver.findElements(ordersLink).isEmpty();
    }

    public boolean hasAdminNavigation() {
        return !driver.findElements(adminProductsLink).isEmpty()
                && !driver.findElements(adminCategoriesLink).isEmpty()
                && !driver.findElements(adminOrdersLink).isEmpty();
    }
}
