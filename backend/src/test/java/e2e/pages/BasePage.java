package e2e.pages;

import e2e.config.E2eConfig;
import e2e.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.time.Duration;

public abstract class BasePage {

    protected final WebDriver driver;
    protected final E2eConfig config;
    protected final WaitUtils wait;

    protected BasePage(WebDriver driver, E2eConfig config) {
        this.driver = driver;
        this.config = config;
        this.wait = new WaitUtils(driver, Duration.ofSeconds(config.getTimeoutSeconds()));
    }

    protected void openRoute(String routePath) {
        String normalized = routePath.startsWith("/") ? routePath : "/" + routePath;
        driver.get(config.getBaseUrl() + "/#" + normalized);
    }

    protected WebElement findVisible(By locator) {
        return wait.waitForElement(locator);
    }

    protected WebElement findPresent(By locator) {
        return wait.present(locator);
    }

    protected void click(By locator) {
        wait.waitForClick(locator);
    }

    protected void type(By locator, String value) {
        WebElement input = findVisible(locator);
        input.clear();
        input.sendKeys(value);
    }

    protected void waitForUrlContains(String value) {
        wait.urlContains(value);
    }

    /** Use for React {@code HashRouter} routes where the path lives in {@code #/...}. */
    protected void waitForUrlOrHashContains(String value) {
        wait.urlOrHashContains(value);
    }

    protected void waitForText(By locator, String value) {
        wait.waitForText(locator, value);
    }
}
